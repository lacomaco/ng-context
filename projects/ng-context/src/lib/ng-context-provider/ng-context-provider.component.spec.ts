import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContextConsumerService } from '../context-consumer.service';
import { NgContextProviderComponent } from './ng-context-provider.component';

// for Provider Test
interface GrandParnetValue {
  color: string;
  width: string;
}

@Component({
  selector:'app-grand-parent',
  template:`
  <ng-context-provider name="colorBox" [value]="redBox">
    <app-parent></app-parent>
  </ng-context-provider>
  <ng-context-provider name="colorBox" [value]="blueBox">
    <app-parent></app-parent>
  </ng-context-provider>
  `
})
class GrandParentComponent {
  redBox:GrandParnetValue = {
    color: 'red',
    width: '10'
  }
  blueBox:GrandParnetValue = {
    color: 'blue',
    width: '15'
  }
}

@Component({
  selector: 'app-parent',
  template: `
  <ng-context-provider [name]="providerName" [value]="value">
    <app-child></app-child>
    <app-child></app-child>
  </ng-context-provider>
  `
})
class ParentComponent {
  providerName = "parent-box";
  value = {
    shareValue:'share'
  }
  constructor(private contextConsumer: ContextConsumerService){}
  getColorValue() {
    return this.contextConsumer.select<{color:string,width:string}>('colorBox');
  }
}

@Component({
  selector: 'app-child',
  template: `
  <ng-container *ngIf="grandParentValue$ | async as grandParentValue">
    {{grandParentValue.color}}
  </ng-container>
  <ng-container *ngIf="parentValue$ | async as parentValue">
    {{parentValue.shareValue}}
  </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ChildComponent {
  parentValue$ = this.contextConsumer.select<{shareValue:string}>('parent-box');
  grandParentValue$ = this.contextConsumer.select<GrandParnetValue>('colorBox');
  constructor(public contextConsumer: ContextConsumerService){}

  changeParentValue(){
    this.contextConsumer.patch<{shareValue:string}>({
      shareValue: 'changed',
    });
  }
} 

describe('NgContextProviderComponent', () => {
  let component: GrandParentComponent;
  let hostFixture: ComponentFixture<GrandParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrandParentComponent,ParentComponent, ChildComponent, NgContextProviderComponent ],
      providers: [
        { provide:ComponentFixtureAutoDetect, useValue: true }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(GrandParentComponent);
    component = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  describe('should it share data?',()=>{
    let parentFirst:DebugElement;
    let parentSecond:DebugElement;
    beforeEach(()=>{
      const parentElements = hostFixture.debugElement.queryAll(By.directive(ParentComponent));
      parentFirst = parentElements[0];
      parentSecond = parentElements[1];
    });
    it('first parent should return color: red, width: 10',()=>{
      parentFirst.componentInstance.getColorValue().subscribe((value: GrandParnetValue)=>{
        expect(value.color).toBe('red');
        expect(value.width).toBe('10');
      })
    });
    it('second parent should return color: blue, width: 15',()=>{
      parentSecond.componentInstance.getColorValue().subscribe((value: GrandParnetValue)=>{
        expect(value.color).toBe('blue');
        expect(value.width).toBe('15');
      })
    });
  });

  describe('should it share data by name?', ()=>{
    let leftChild: DebugElement;
    let rightChild: DebugElement;
    beforeEach(()=>{
      const childes = hostFixture.debugElement.queryAll(By.directive(ChildComponent));
      leftChild = childes[0];
      rightChild = childes[2];
    })
    it('get parent data by name (left parent)', ()=>{
      expect(leftChild.nativeElement.innerHTML.includes('red')).toBe(true);
      expect(leftChild.nativeElement.innerHTML.includes('share')).toBe(true);
    });
    it('get grandParent data by name (right parent)',()=>{
      expect(rightChild.nativeElement.innerHTML.includes('blue')).toBe(true);
      expect(rightChild.nativeElement.innerHTML.includes('share')).toBe(true);
    });
  });

  describe('should it thorw error when name changed?', ()=>{
    let parent: DebugElement;
    beforeEach(()=>{
      parent = hostFixture.debugElement.query(By.directive(ParentComponent));
    });
    it('change name must throw error',()=>{
      try{
        const instance = parent.componentInstance;
        instance.providerName = 'make error';
      }catch(e){
        expect(true).toBe(true);
      }
    })
  });

  describe('should it change when shared data change',()=>{
    let leftChild: DebugElement;
    let rightChild: DebugElement;
    beforeEach(()=>{
      const childes = hostFixture.debugElement.queryAll(By.directive(ChildComponent));
      leftChild = childes[0];
      rightChild = childes[1];
      leftChild.componentInstance.changeParentValue();
      hostFixture.changeDetectorRef.checkNoChanges();
    })
    it('left value should be changed', async ()=>{
      hostFixture.detectChanges();
      expect(leftChild.nativeElement.innerHTML.includes('changed')).toBe(true)
    });
    it('right value should be changed', ()=>{
      hostFixture.detectChanges();
      expect(rightChild.nativeElement.innerHTML.includes('changed')).toBe(true);
    });
    it('others should not be changed',()=>{
      const otherChilds = hostFixture.debugElement.queryAll(By.directive(ChildComponent));
      const others = otherChilds[2];
      hostFixture.detectChanges();
      expect(others.nativeElement.innerHTML.includes('changed')).toBe(false);
    })
  });
});
