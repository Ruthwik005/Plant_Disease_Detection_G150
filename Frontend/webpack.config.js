const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve("process"), // Polyfill for process
      fs: false, // Exclude fs from the bundle
      path: false, // Exclude path from the bundle
      os: false, // Exclude os from the bundle
      stream: false, // Exclude stream from the bundle
      constants: false, // Exclude constants from the bundle
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser", // Ensures process is available globally
    }),
  ],
  "browser": {
  "graceful-fs": false
    }

//   externals: {
//     fs: "commonjs fs", // Marks `fs` as an external dependency for backend-only usage
//   },
};
