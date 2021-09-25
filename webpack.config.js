const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.tsx",
    worker: "./src/worker.ts",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: { process: require.resolve("process/browser") },
  },
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]",
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      excludeChunks: ["worker"],
    }),
    new webpack.ProvidePlugin({ process: "process" }),
  ],
};
