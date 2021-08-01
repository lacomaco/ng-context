import { Component, OnInit,SimpleChanges,Input } from '@angular/core';
import { ContextConsumerService } from '../context-consumer.service';
import { noAssigned } from '../internal-constants';

@Component({
  selector: 'lib-ng-context-provider',
  templateUrl: './ng-context-provider.component.html',
  providers:[ContextConsumerService]
})
export class NgContextProviderComponent implements OnInit {
  
  @Input()
  name: string = noAssigned.name;

  @Input()
  value: any = noAssigned.value;

  constructor(private currentContext:ContextConsumerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.name && !changes.name.firstChange){
      throw new Error('ng-context provider name cannot be changed');
    }
    if(changes.value && !changes.value.firstChange){
      const {currentValue} = changes.value;
      this.currentContext.patch<any>(currentValue);
    }
  }

  ngOnInit(): void {
    if(!this.name){
      throw new Error('ng-context-provider name required');
    }
    this.currentContext.setName(this.name);
    this.currentContext.patch<any>(this.value);
  }
}
