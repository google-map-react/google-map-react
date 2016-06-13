import { Component } from 'react';
import createEagerFactory from './createEagerFactory';
import { createSelector } from 'reselect';

const withStateSelector = (stateName, stateUpdaterName, ...selectorArgs) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent);
    return class extends Component {
      selector = createSelector(...selectorArgs);
      state = {
        stateValue: this.selector(this.props),
      };

      updateStateValue = (updateFn, callback) => (
        this.setState(({ stateValue }) => ({
          stateValue: typeof updateFn === 'function'
            ? updateFn(stateValue)
            : updateFn,
        }), callback)
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

export default withStateSelector;
