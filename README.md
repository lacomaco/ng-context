# NgContext

Angular Context API Module Inspired By React Context API

## 사용법

Provider 사용예

```html
<ng-context.provider name="colorProvider" value="red">
    <app-consumer></app-consumer>
</ng-context.provider>

<ng-context.provider name="colorProvider" value="blue">
    <app-consumer></app-consumer>
</ng-context.provider>
```

Consumer 사용예

```ts
@Component({
    selector:'app-consumer',
    ...
})
export class Consumer implements OnInit{
    selectContext$;
    constructor(private context: ContextConsumerService){}

    ngOnInit(): void{
        this.selectContext$ = this.context.select<string>('colorProvider');
    }
}
```

```html
<ng-container *ngIf="selectContext$ | async as context">
    {{context}}
</ng-container>
```
