const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  debug: !isProduction,
  devtool: isProduction ? '' : 'eval-source-map',
  entry: isProduction
    ? [
      './src/client/index'
    ]
    : [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './src/client/index'
    ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Jeopardy',
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        IS_BROWSER: true, // Because webpack is used only for browser code.
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development')
      }
    }),
    new webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react'
    }),
    ...(isProduction
    ? [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ]
    : [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ])
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: [
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'public')
        ],
        exclude: path.join(__dirname, 'src'),
        loader: 'style!css'
      }, {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'node_modules'),
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]__[hash:base64:5]!postcss-loader'
      }, {
        loader: 'url-loader?limit=10000',
        include: path.join(__dirname, 'images'),
        test: /\.(gif|jpg|png)$/
      },{
        loader: 'url-loader?limit=10000',
        include: path.join(__dirname, 'images'),
        test: /\.(gif|jpg|png|svg)$/
      },
      {
        loader: 'url-loader?limit=1',
        include: path.join(__dirname, 'public'),
        test: /favicon\.ico$/
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        include: path.join(__dirname, 'public/fonts'),
        loader: 'url?limit=200000'
      }, {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'node_modules'),
        loader: 'babel',
        query: {
          cacheDirectory: true,
          env: {
            development: {
              presets: ['modern', 'react', 'stage-0'],
              plugins: [
                'transform-decorators-legacy'
              ]
            },
            production: {
              presets: ['modern', 'react', 'react-optimize', 'stage-0'],
              plugins: [
                'transform-decorators-legacy'
              ]
            }
          }
        }
      }
    ]
  },
  postcss: function (webpack) {
    return [
      require('postcss-import')({ addDependencyTo: webpack, path: ['src/client/styles'] }),
      require('postcss-cssnext')()
    ]
  },
  standard: {
    parser: 'babel-eslint'
  },
  resolve: {
    extensions: ['', '.js'], // .json is ommited to ignore ./firebase.json
    modulesDirectories: ['src/client', 'node_modules'],
    root: __dirname,
    alias: {
      components: 'src/client/components',
      images: 'public/images',
      fonts: 'public/fonts',
      client: 'src/client'
    }
  },
  profile: true,
  stats: {
    timings: true,
    reasons: true,
    errors: true,
    errorDetails: true,
    warnings: true
  }
}
