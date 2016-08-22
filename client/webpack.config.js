'use strict';

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const wpconf = require('./config/webpack/wpconf');
const config = require('./config/build');

module.exports = wpconf({
  entry: config.js.src
});
