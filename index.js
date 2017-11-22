(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact'), require('statenano')) :
	typeof define === 'function' && define.amd ? define(['exports', 'preact', 'statenano'], factory) :
	(factory((global.PreactStateNano = global.PreactStateNano || {}),global.preact,global.StateNano));
}(this, (function (exports,preact,StateNano) { 'use strict';

StateNano = StateNano && 'default' in StateNano ? StateNano['default'] : StateNano;

function connect(){
    var states = [], len = arguments.length;
    while ( len-- ) states[ len ] = arguments[ len ];

    var map   = function (state){ return state; },
        Child = function (){},
        Connect = (function (Component$$1) {
        function Connect () {
            Component$$1.apply(this, arguments);
        }

        if ( Component$$1 ) Connect.__proto__ = Component$$1;
        Connect.prototype = Object.create( Component$$1 && Component$$1.prototype );
        Connect.prototype.constructor = Connect;

        Connect.prototype.componentWillMount = function componentWillMount (){
                var this$1 = this;

                var nextState = {},
                    provider  = 'provider' in this.context ? this.context.provider : {}; 
                this.unsubscribers = states.map(function (state){
                  var type   = typeof state,
                      select =  type === 'string' ? {name : state,state:provider[state]}:
                                type === 'object' ? state : {};
                                
                  if( select.name && select.state instanceof StateNano ){
                      nextState[select.name] = select.state;
                      return select.state.subscribe(function (next){
                        this$1.setState(( obj = {}, obj[select.name] = next, obj ));
                        var obj;
                      });
                  }else{
                    throw (state + " it is not a valid state");
                  }
                });
                this.setState(nextState);
            };
            Connect.prototype.componentWillUnmount = function componentWillUnmount (){
                ( this.unsubscribers || [] ).map(function (unsubscribe){ return unsubscribe(); });
            };
            Connect.prototype.createNextProps = function createNextProps (props){
              props.state = map(this.state);
              return props;
            };
            Connect.prototype.render = function render (props,state){
              return preact.h( Child, this.createNextProps(props), props.children)
            };
            Connect.with = function with$1 (nextChild){
              Child = nextChild;
              return this;
            };
            Connect.map = function map$1 (nextMap){
              map = nextMap;
              return this;
            };

        return Connect;
    }(preact.Component));
    return Connect;
}

var Provider = (function (Component$$1) {
  function Provider () {
    Component$$1.apply(this, arguments);
  }

  if ( Component$$1 ) Provider.__proto__ = Component$$1;
  Provider.prototype = Object.create( Component$$1 && Component$$1.prototype );
  Provider.prototype.constructor = Provider;

  Provider.prototype.getChildContext = function getChildContext (){
        var this$1 = this;

        var provider = {};
        Object.keys(this.props).map(function (prop){
            if( prop === 'children'){ return; }
            provider[prop] = this$1.props[prop];
        });
        return {provider: provider};
    };
    Provider.prototype.render = function render (ref){
      var children = ref.children;

      return children[0]
    };

  return Provider;
}(preact.Component));

exports.connect = connect;
exports.Provider = Provider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
