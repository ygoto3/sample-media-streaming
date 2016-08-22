'use strict';

const src = './src';
const dest = './build';

module.exports = {

  production: process.env.NODE_ENV === 'production',

  js: {
    src: `${src}/index.ts`,
    dest: `${dest}`,
    output: {
      filename: 'app.js',
      sourceMapFilename: 'app.js.map',
    },
    testSrc: `${src}/**/*.ts`
  },

  css: {
    src: `${src}/style.css`,
    dest: `${dest}`
  },

  html: {
    src: `${src}/index.html`,
    dest: `${dest}`
  }

};
