// const webpack = require('webpack');
// const CopyPlugin = require('copy-webpack-plugin');

// module.exports = function override(config, env) {
//   config.resolve.fallback = {
//     ...config.resolve.fallback,
//     stream: require.resolve('stream-browserify'),
//     path: require.resolve('path-browserify'),
//     child_process: false,
//     fs: false,
//   };

//   config.plugins.push(
//     new CopyPlugin({
//       patterns: [
//         {
//             from: 'node_modules/@pdftron/webviewer/public',
//             to: 'public/webviewer',
//         },
//       ],
//     })
//   );

//   return config;
// };
