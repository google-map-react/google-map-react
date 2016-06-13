import React, { Component } from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import layoutStyles from './Layout.sass';
import GMap from './GMap';
// for hmr to work I need the first class to extend Component
export class Layout extends Component { // eslint-disable-line
  render() {
    const { styles: { layout, header, main, footer, logo } } = this.props;
    return (
      <div className={layout}>
        <header className={header}>
          <div>
            Clustering example google-map-react (zoom, move to play with)
          </div>
          <div>
            <a href="https://github.com/istarkov/google-map-clustering-example">
              Star at github.com
            </a>
          </div>
        </header>
        <main className={main}>
          <GMap />
        </main>
        <footer className={footer}>
          <div>
            <a href="https://github.com/istarkov">
              Ivan Starkov
            </a>
          </div>
          <div className={logo}></div>
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
