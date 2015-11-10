var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var promise = require('es6-promise').polyfill();
var Clean = require('clean-webpack-plugin');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var pkg = require('./package.json');
var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './app/index' // Your appʼs entry point
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'] // resolve extensions js, jsx
  },
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      // add JSHint
      {
        test: /\.js?$/,
        loaders: ['jshint'], 
        include: APP_PATH
      }
    ],
    loaders: [
      // add Bootstrap
      { 
        test: /bootstrap\/js\//, 
        loader: 'imports?jQuery=jquery' 
      },
      // Compile jsx ES6 with bable
      // add React-hot loader
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: APP_PATH
      },
      // Load image files
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ]
  }
};

// Run dev server
if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    module: {
      loaders: [ 
        // Load scss 
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        },
        // Load fonts
        {
          test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          loader : 'file-loader'
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlwebpackPlugin({
        title: 'Alt'
      })
    ]
  });
}

// Run build
if(TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    entry: {
      app: './app/index'
    },
    output: {
      path: BUILD_PATH,
      filename: '[name].[chunkhash].js',
    },
    module: {
      loaders: [
        // Load fonts
        {
          test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          loader : 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
        },
        // Load scss files
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('css!sass')
        }
      ]
    },
    devtool: 'eval',
    plugins: [
      // Remove build folder
      new Clean(['build']),
      // Extract css file
      new ExtractTextPlugin('styles.[chunkhash].css'),
      // Generate index.html
      new HtmlwebpackPlugin({
        title: 'Alt',
        "assets": {
          "style"  : "styles.[chunkhash].css",
        }
      }),
      // Optimize js
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
