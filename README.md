# NgContext

Angular Context API Module Inspired By React Context API

## 사용법

Provider

```html
<ng-context-provider name="colorProvider" value="red">
    <app-consumer></app-consumer>
</ng-context-provider>

<ng-context-provider name="colorProvider" value="blue">
    <app-consumer></app-consumer>
</ng-context-provider>
```

Consumer

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

### How It Works?

ng-context.provider 컴포넌트가 생성되면 Element Injector Tree에 Context를 저장하고 접근을 도와주는 ContextConsumerService 객체를 생성합니다.

ng-context.provider 아래에 생성된 컴포넌트는 이 ContextConsumerService를 DI받아 데이터에 접근하는게 가능합니다

