import { Component } from 'react';
import omit from './omit';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

import createHelper from './createHelper';
import createEagerFactory from './createEagerFactory';

const prop2Stream = (propName, comparator = (a, b) => a === b) =>
  BaseComponent => {
    const factory = createEagerFactory(BaseComponent);
    return class extends Component {
      props$ = new BehaviorSubject(this.props[propName]).distinctUntilChanged(
        comparator
      );

      componentWillReceiveProps(nextProps) {
        this.props$.next(nextProps[propName]);
      }

      render() {
        return factory({
          ...omit(this.props, [propName]),
          [`${propName}$`]: this.props$,
        });
      }
    };
  };

export default createHelper(prop2Stream, 'prop2Stream');
