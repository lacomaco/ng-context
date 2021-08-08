# NgContext

Angular Context API Module Inspired By React Context API

```shell
npm i ng-context-api
```

# Usage

### Provider

```html
<ng-context-provider name="colorProvider" value="red">
    <app-consumer></app-consumer>
</ng-context-provider>

<ng-context-provider name="colorProvider" value="blue">
    <app-consumer></app-consumer>
</ng-context-provider>
```

### Consumer

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