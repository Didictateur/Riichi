const path = require('path');

module.exports = {
  entry: './src/display/dp1.ts', // Point d'entrée principal
  output: {
    filename: 'dp1.js', // Fichier de sortie
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'], // Extensions prises en charge
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

