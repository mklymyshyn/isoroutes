/**EMACS* (setq js3-indent-level 8) */
var webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: __dirname + "/app/client.js",
  resolveLoader: {
    root: __dirname + "/node_modules/"
  },
  resolve: {
    paths: ["."],
    root: ".", //__dirname + "/node_modules",
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ["node_modules", __dirname + "/node_modules"],
  },
  target: "web",
  module: {
    include: [
      __dirname + "/node_modules/node-libs-browser/node_modules/**/*js"
    ],
    loaders: [
      { test: /(\.js|\.jsx)$/, loader: 'babel-loader'},
      { test: /(\.js|\.jsx)$/, loader: 'regenerator'}      
    ]
  },
  plugins: [
//    new webpack.IgnorePlugin(/node_modules/)
  ],
  externals: [
    {process: true, "timers-browserify": true} 
  ],
  output: {
    path: __dirname + "/build",
    filename: "app.js"
  }
}
