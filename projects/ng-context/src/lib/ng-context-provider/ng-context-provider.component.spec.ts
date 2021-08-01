import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgContextProviderComponent } from './ng-context-provider.component';

describe('NgContextProviderComponent', () => {
  let component: NgContextProviderComponent;
  let fixture: ComponentFixture<NgContextProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgContextProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgContextProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
