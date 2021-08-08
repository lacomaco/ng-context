# NgContext

Angular Context API Module Inspired By React Context API

```shell
npm i ng-context-api
```

npm : https://www.npmjs.com/package/ng-context-api

# Usage

# NgContext

Angular Context API Module Inspired By React Context API

```shell
npm i ng-context-api
```

npm : https://www.npmjs.com/package/ng-context-api

# Usage

### Setting

```ts
// in app module

import {NgContextModule} from 'ng-context-api';

@NgModule({
  declarations: [
      ...
  ],
  imports: [
      ...
    NgContextModule // import this module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

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