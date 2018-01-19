import {h,Component} from 'preact';

export default function connect(...states){
    let map   = (state)=>state,
        Child = ()=>{},
        Connect = class extends Component{
            componentWillMount(){
                let nextState = {},
                    provider  = 'provider' in this.context ? this.context.provider : {}; 
                this.unsubscribers = states.map((state)=>{
                  let type   = typeof state,
                      select =  type === 'string' ? {name : state,state:provider[state]}:
                                type === 'object' ? state : {}
                                
                  if( select.name && select.state &&  'subscribe' in select.state ){
                      nextState[select.name] = select.state;
                      return select.state.subscribe((next)=>{
                        this.setState({[select.name]:next})
                      });
                  }else{
                    throw `${state} it is not a valid state`;
                  }
                })
                this.setState(nextState);
            }
            componentWillUnmount(){
                ( this.unsubscribers || [] ).map((unsubscribe)=> unsubscribe())
            }
            render( props ){
                let state = map(this.state,props);
                return state && <Child {...{...props,state}}>{props.children}</Child>;
            }
            static with(nextChild){
              Child = nextChild;
              return this;
            }
            static map(nextMap){
              map = nextMap;
              return this;
            }
        }
    return Connect;
}