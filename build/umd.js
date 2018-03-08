(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact')) :
	typeof define === 'function' && define.amd ? define(['exports', 'preact'], factory) :
	(factory((global.PreactStateNano = {}),global.preact));
}(this, (function (exports,preact) { 'use strict';

var Subscribe = (function (Component) {
    function Subscribe () {
        Component.apply(this, arguments);
    }

    if ( Component ) Subscribe.__proto__ = Component;
    Subscribe.prototype = Object.create( Component && Component.prototype );
    Subscribe.prototype.constructor = Subscribe;

    Subscribe.prototype.componentWillMount = function componentWillMount () {
        var this$1 = this;

        var nextState = {},
            provider =
                "provider" in this.context ? this.context.provider : {};
        this.unsubscribers = this.states.map(function (state) {
            var type = typeof state,
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
                return select.state.subscribe(function (next) {
                    this$1.setState(( obj = {}, obj[select.name] = next, obj));
                    var obj;
                });
            } else {
                throw (state + " it is not a valid state");
            }
        });
        this.setState(nextState);
    };
    Subscribe.prototype.componentWillUnmount = function componentWillUnmount () {
        (this.unsubscribers || []).map(function (unsubscribe) { return unsubscribe(); });
    };

    return Subscribe;
}(preact.Component));

function connect() {
    var states = [], len = arguments.length;
    while ( len-- ) states[ len ] = arguments[ len ];

    var map,
        Child,
        Connect = (function (Subscribe) {
        function Connect(){
                Subscribe.call(this);
                this.states = states;
            }

        if ( Subscribe ) Connect.__proto__ = Subscribe;
        Connect.prototype = Object.create( Subscribe && Subscribe.prototype );
        Connect.prototype.constructor = Connect;
            Connect.prototype.render = function render (props) {
                var state = map && map(this.state, props);
                return (
                    Child &&
                    state && (
                        preact.h( Child, Object.assign({}, props, {state: state}))
                    )
                );
            };
            Connect.with = function with$1 (nextChild) {
                Child = nextChild;
                return this;
            };
            Connect.map = function map$1 (nextMap) {
                map = nextMap;
                return this;
            };

        return Connect;
    }(Subscribe));
    return Connect;
}

var Provider = (function (Component) {
    function Provider () {
        Component.apply(this, arguments);
    }

    if ( Component ) Provider.__proto__ = Component;
    Provider.prototype = Object.create( Component && Component.prototype );
    Provider.prototype.constructor = Provider;

    Provider.prototype.getChildContext = function getChildContext () {
        var this$1 = this;

        var provider = {};
        Object.keys(this.props).map(function (prop) {
            if (prop === "children") { return; }
            provider[prop] = this$1.props[prop];
        });
        return { provider: provider };
    };
    Provider.prototype.render = function render (ref) {
        var children = ref.children;

        return children[0];
    };

    return Provider;
}(preact.Component));

exports.connect = connect;
exports.Provider = Provider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
