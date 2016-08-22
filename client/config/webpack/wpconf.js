'use strict';

const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = require('../build');
const env = require('../env');

const projPath = path.resolve(__dirname, '../..');
const destPath = path.resolve(projPath, config.js.dest);

const cssLoader = 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss';

module.exports = merge => {
  let wpc = Object.assign(merge || {}, {

    plugins: [
      new ExtractTextPlugin( path.resolve(destPath, "app.css") )
    ],

    output: {
      filename: path.resolve(destPath, config.js.output.filename),
      sourceMapFilename: path.resolve(destPath, config.js.output.sourceMapFilename),
      libraryTarget: 'umd'
    },
    
    resolve: {
      extensions: [ '', '.ts', '.js', '.css' ]
    },
    
    module: {
    
      loaders: [{
        test: /\.ts$/,
        loader: `ts!preprocess?API_URL=${env.API_URL}`
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', cssLoader)
      }, {
        test: /\.json$/,
        loader: 'json'
      }]

    },

    postcss: [
      require("postcss-import")({path: ["node_modules", "./src"]}),
      require("postcss-cssnext")()
    ]
  
  });
  
  if (!config.production) {
    wpc.devtool = "#source-map";
    wpc.debug = true;
  }
  
  return wpc;
};
