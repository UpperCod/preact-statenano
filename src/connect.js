import { h, Component } from "preact";

export class Subscribe extends Component{
    componentWillMount() {
        let nextState = {},
            provider =
                "provider" in this.context ? this.context.provider : {};
        this.unsubscribers = this.states.map(state => {
            let type = typeof state,
                select =
                    type === "string"
                        ? { name: state, state: provider[state] }
                        : type === "object" ? state : {};

            if (
                select.name &&
                select.state &&
                "subscribe" in select.state
            ) {
                nextState[select.name] = select.state;
                return select.state.subscribe(next => {
                    this.setState({ [select.name]: next });
                });
            } else {
                throw `${state} it is not a valid state`;
            }
        });
        this.setState(nextState);
    }
    componentWillUnmount() {
        (this.unsubscribers || []).map(unsubscribe => unsubscribe());
    }
}

export default function connect(...states) {
    let map,
        Child,
        Connect = class extends Subscribe {
            constructor(){
                super();
                this.states = states;
            }
            render(props) {
                let state = map && map(this.state, props);
                return (
                    Child &&
                    state && (
                        <Child {...{ ...props, state }}/>
                    )
                );
            }
            static with(nextChild) {
                Child = nextChild;
                return this;
            }
            static map(nextMap) {
                map = nextMap;
                return this;
            }
        };
    return Connect;
}
