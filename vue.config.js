// const path = require("path")
const webpack = require('webpack')

module.exports = {
  pwa: {
    name: 'The Off App',
    themeColor: '#1C2536'
  },
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /de|en/
      )
    ]
  }
}
