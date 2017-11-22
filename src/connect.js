import {h,Component} from 'preact';
import StateNano from 'statenano';

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
                                
                  if( select.name && select.state instanceof StateNano ){
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
            createNextProps(props){
              props.state = map(this.state);
              return props;
            }
            render(props,state){
              return <Child {...this.createNextProps(props)}>{props.children}</Child>
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