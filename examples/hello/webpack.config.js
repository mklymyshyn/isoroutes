/**EMACS* (setq js3-indent-level 8) */
var webpack = require("webpack");


module.exports = {
  context: __dirname,
  entry: __dirname + "/app/client.js",
  resolveLoader: { root: __dirname + "/node_modules" },
  resolve: {
    paths: ["."],
    root: __dirname + "/node_modules",
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ["node_modules"],
  },
  target: "web",
  
  module: {
    loaders: [
      { test: /(\.js|\.jsx)$/, loader: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/node_modules/)
  ],
  output: {
    path: __dirname + "/build",
    filename: "app.js"
  }
}
