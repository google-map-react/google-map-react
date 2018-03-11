import React from 'react';
import { compose } from 'recompose';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/distinctUntilChanged';

import SimpleMarker from './SimpleMarker';

import stream2Props from '../utils/stream2Props';

export const reactiveMarker = props => <SimpleMarker {...props} />;

export const reactiveMarkerHOC = compose(
  stream2Props(({ id, hoveredMarkerId$ }) =>
    hoveredMarkerId$
      .map(hoveredMarkerId => hoveredMarkerId === id)
      .distinctUntilChanged()
      .map(v => ({ hovered: v })))
);

export default reactiveMarkerHOC(reactiveMarker);
