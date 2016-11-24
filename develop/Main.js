// file: main.jsx
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './Layout';
import GMap from './GMap';
import GMapLayers from './GMapLayers';
import GMapOptim from './GMapOptim';
import GMapResizable from './GMapResizable';
import GMapWithClustering from './GMapWithClustering';

import 'normalize.css/normalize.css';
import './Main.sass';

const mountNode = document.getElementById('app');

render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <Route markersCount={50} path="hoverunoptim" component={GMap} />
      <Route markersCount={50} path="layers" component={GMapLayers} />
      <Route markersCount={50} path="hoveroptim" component={GMapOptim} />
      <Route markersCount={20} path="resizable" component={GMapResizable} />
      <Route markersCount={2000} path="clustering" component={GMapWithClustering} />
      <IndexRoute markersCount={20} component={GMap} />
    </Route>
  </Router>
  ,
  mountNode
);
