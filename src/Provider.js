import { h, Component } from "preact";

export default class Provider extends Component {
    getChildContext() {
        let provider = {};
        Object.keys(this.props).map(prop => {
            if (prop === "children") return;
            provider[prop] = this.props[prop];
        });
        return { provider };
    }
    render({ children }) {
        return children[0];
    }
}
