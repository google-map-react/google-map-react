import path from 'path'; // eslint-disable-line no-var
import autoprefixer from 'autoprefixer'; // eslint-disable-line no-var
import webpack from 'webpack';

export default {
  devtool: 'cheap-module-eval-source-map',
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
  plugins: [
    new webpack.DefinePlugin(
      process.env.NODE_ENV
        ? {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          }
        : {}
    ),
  ],
  module: {
    loaders: [
      {
        test: /\.sass$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]',
          'postcss-loader',
          'sass-loader?precision=10&indentedSyntax=sass',
        ],
        include: [
          path.join(__dirname, '../../src'),
          path.join(__dirname, '..'),
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
          'postcss-loader',
        ],
        include: [
          path.join(__dirname, '..'),
          path.join(__dirname, '../../node_modules'),
        ],
      },
      {
        test: /\.svg$/,
        loaders: ['url-loader?limit=7000'],
      },
    ],
  },
};
