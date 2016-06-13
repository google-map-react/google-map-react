// file: main.jsx
import React from 'react';
import { render } from 'react-dom';
import Layout from './Layout.js';

import 'normalize.css/normalize.css';
import './Main.sass';

const mountNode = document.getElementById('app');

render(<Layout />, mountNode);
