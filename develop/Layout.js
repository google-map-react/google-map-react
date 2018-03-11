import { Link } from 'react-router';
import React, { Component } from 'react';
import { compose, defaultProps } from 'recompose';

import layoutStyles from './Layout.sass';

// for hmr to work I need the first class to extend Component
/* eslint-disable react/prefer-stateless-function */
export class Layout extends Component {
  render() {
    const {
      styles: { layout, header, main, footer, logo, links },
    } = this.props;
    return (
      <div className={layout}>
        <header className={header}>
          <div className={links}>
            <Link to="/">Multi Markers</Link>
            <Link to="/layers">With layers</Link>
            <Link to="/hoverunoptim">Hover unoptim</Link>
            <Link to="/hoveroptim">Hover optim</Link>
            <Link to="/resizable">Resizable Map</Link>
            <Link to="/heatmap">Heatmap</Link>
          </div>
          <div>
            <a href="https://github.com/istarkov/google-map-clustering-example">
              Star at github.com
            </a>
          </div>
        </header>
        <main className={main}>
          {this.props.children}
        </main>
        <footer className={footer}>
          <div>
            <a href="https://github.com/istarkov">
              Ivan Starkov
            </a>
          </div>
          <div className={logo} />
          <div>
            <a href="https://twitter.com/icelabaratory">
              @icelabaratory
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export const layoutHOC = compose(
  defaultProps({
    styles: layoutStyles,
  })
);

export default layoutHOC(Layout);
