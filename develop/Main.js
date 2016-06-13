// file: main.jsx
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './Layout';
import GMap from './GMap';

import 'normalize.css/normalize.css';
import './Main.sass';

const mountNode = document.getElementById('app');

render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <Route markersCount={200} path="hoveroptim" component={GMap} />
      <IndexRoute markersCount={20} component={GMap} />
    </Route>
  </Router>
  ,
  mountNode
);
