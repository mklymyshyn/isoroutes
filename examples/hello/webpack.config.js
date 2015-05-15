var webpack = require("webpack");

module.exports = {
  context: __dirname + "/",
  entry: __dirname + "/client.js",
  module: {
    loaders: [
      { test: /\.jsx$/, loader: "jsx-loader" },            
      { test: /(\.js|\.jsx)/, exclude: /node_modules/, loader: 'babel?optional[]=runtime&stage=0'},
      { test: /(\.js|\.jsx)/, loader: 'regenerator-loader' },      
    ]
  },
  plugins: [
    
  ],
  output: {
    path: __dirname + "/build",
    filename: "app.js"
  }
}
