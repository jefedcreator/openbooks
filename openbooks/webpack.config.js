const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // ... your other Webpack configurations ...
  plugins: [
    // ... your other plugins ...
    new CopyPlugin([
      {
        from: 'node_modules/@pdftron/webviewer/public',
        to: 'public/webviewer',
      },
    ]),
  ],
};
