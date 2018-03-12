import { Component } from 'react';
import createHelper from 'recompose/createHelper';
import createEagerFactory from './createEagerFactory';

const withStateSelector = (stateName, stateUpdaterName, selectorFactory) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent);
    return class extends Component {
      selector = selectorFactory();
      state = {
        stateValue: this.selector(this.props),
      };

      updateStateValue = (updateFn, callback) =>
        this.setState(
          ({ stateValue }) => ({
            stateValue: typeof updateFn === 'function'
              ? updateFn(stateValue)
              : updateFn,
          }),
          callback
        );

      componentWillReceiveProps(nextProps) {
        // reselect memoize result
        const nextStateValue = this.selector(nextProps);
        if (nextStateValue !== this.state.stateValue) {
          this.setState({
            stateValue: nextStateValue,
          });
        }
      }

      render() {
        return factory({
          ...this.props,
          [stateName]: this.state.stateValue,
          [stateUpdaterName]: this.updateStateValue,
        });
      }
    };
  };

export default createHelper(withStateSelector, 'withStateSelector');
