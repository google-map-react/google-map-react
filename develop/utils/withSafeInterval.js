import { createElement, Component } from 'react';

const safeTimerFactory = (setFn, clearFn, propName, hocName) =>
  Target => {
    class SafeTimer extends Component {
      constructor(props, context) {
        super(props, context);

        this.unsubscribers = [];
        this[propName] = this[propName].bind(this);
      }

      componentWillUnmount() {
        this.unsubscribers.forEach(unsubscribe => unsubscribe());

        this.unsubscribers = [];
      }

      [propName](...args) {
        const id = setFn(...args);
        const unsubscriber = () => clearFn(id);

        this.unsubscribers.push(unsubscriber);

        return unsubscriber;
      }

      render() {
        return createElement(Target, {
          ...this.props,
          [propName]: this[propName],
        });
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      SafeTimer.displayName = `${hocName}`;
    }

    return SafeTimer;
  };

export default safeTimerFactory(
  global.setInterval,
  global.clearInterval,
  'setSafeInterval',
  'withSafeInterval'
);
