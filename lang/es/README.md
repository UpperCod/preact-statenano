#preact-statenano

es una pequeña librería que permite sincronizar los eventos del estado creados a base de StateNano con componentes creados con preact todo  gracias a los componentes de alto orden.

### yarn

```bash
yarn add -D preact-statenano
```
### npm

```bash
npm install -D preact-statenano
```

### Ejemplo Provider

puede ingrezar a [codesandbox.io](https://codesandbox.io/s/4xjvlqx870) para ver un ejemplo de **preact-statenano** y [statenano](https://github.com/UpperCod/statenano)

```javascript
import { h, Component, render } from "preact";
import {Provider} from 'preact-statenano';
import App   from './components/App';
import Todo  from './states/Todo';

render(
   <Provider todo={new Todo({tasks:[]})}>
       <App/>
   <Provider/>
)
```

### Ejemplo Connect

connect permite generar un componente que posee 2 propiedades estáticas:

- **with** : permite asignar un componente al nuevo componente generado por connect
- **map**  : permite mapear el nuevo estado, este debe retornar un objeto

```javascript

import { h, Component, render } from "preact";
import {connect} from 'preact-statenano';

function Todo({state}){
   return <h1>Todo!</h1>
}

return connect('todo').with(Todo).map({todo}=>todo)

```


