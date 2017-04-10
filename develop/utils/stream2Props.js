import { Component } from 'react';
import createHelper from 'recompose/createHelper';
import createEagerFactory from './createEagerFactory';

// if stream prop will change this will fail,
// this is expected behavior
const stream2Props = props2Stream =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent);
    return class extends Component {
      state = {};

      componentWillMount() {
        this.subscription = props2Stream(this.props).subscribe(value =>
          this.setState({ value }));
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        return factory({
          ...this.props,
          ...this.state.value,
        });
      }
    };
  };

export default createHelper(stream2Props, 'stream2Props');
