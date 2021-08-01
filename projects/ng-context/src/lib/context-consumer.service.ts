import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable, timer, race } from 'rxjs';
import { filter, map, switchAll } from 'rxjs/operators';
import { noAssigned } from './internal-constants';

const limitTime = 10;

@Injectable()
export class ContextConsumerService {
  private nameCount = 0;
  private name$ = new BehaviorSubject<string>(noAssigned.name);
  private value$ = new BehaviorSubject<any>(noAssigned.value);
  constructor(@Optional() @SkipSelf() private parentContext:ContextConsumerService){}

  ngOnDestroy(): void{
      this.value$.complete();
  }

  select<T>(name:string): Observable<T>{
     const waitUntilNameReach = this.name$.pipe(filter(name=>name!==noAssigned.name));
     const timeout = timer(limitTime);

     const waitNameReachWithTimeout = race(waitUntilNameReach,timeout).pipe(
         map((value: string | number)=>{
             if(typeof value === 'number'){
                 throw new Error('provider name set time has expired');
             }
             return value;
         })
     );

     const findValue = waitNameReachWithTimeout.pipe(map(currentName=>{
         if(currentName === name){
             return this.value$.pipe(map((value:T)=>value));
         }

         if(!this.parentContext){
             throw new Error('can\'t find name matched context');
          }

          return this.parentContext.select<T>(name);
     }),switchAll());

     return findValue;
  }

  patch<T>(value: T): void{
      this.value$.next(value);
  }

  setName(name:string):void{
      if(this.nameCount > 0){
          throw new Error('ng-context consumerService name cannot be changed');
      }

      this.nameCount++;
      this.name$.next(name);
  }
}
