/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'normalize.css/normalize.css';

import GMap from './GMap';
import Layout from './Layout';
import GMapOptim from './GMapOptim';
import GMapLayers from './GMapLayers';
import GMapHeatmap from './GMapHeatmap';
import GMapResizable from './GMapResizable';

import './Main.sass';

const mountNode = document.getElementById('app');

render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <Route markersCount={50} path="hoverunoptim" component={GMap} />
      <Route markersCount={50} path="layers" component={GMapLayers} />
      <Route markersCount={50} path="hoveroptim" component={GMapOptim} />
      <Route markersCount={20} path="resizable" component={GMapResizable} />
      <Route markersCount={20} path="heatmap" component={GMapHeatmap} />
      <IndexRoute markersCount={20} component={GMap} />
    </Route>
  </Router>,
  mountNode
);
