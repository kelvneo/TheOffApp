const path = require("path");
const webpack = require("webpack");

module.exports = {
  pwa: {
    name: 'The Off App',
    themeColor: '#ffffff',
  },
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[\/\\]locale$/,
        /de|en/
      )
    ]
  }
};
  