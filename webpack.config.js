const path = require('path');
const fs = require('fs');

// Fonction pour détecter automatiquement les fichiers dp*.ts
function getEntryPoints() {
  const displayDir = path.resolve(__dirname, 'src', 'display');
  const files = fs.readdirSync(displayDir); // Lire les fichiers du répertoire
  const entryPoints = {};

  files.forEach((file) => {
    if (file.startsWith('dp') && file.endsWith('.ts')) {
      const name = path.basename(file, '.ts'); // Nom du fichier sans extension
      entryPoints[name] = path.join(displayDir, file); // Chemin complet du fichier
    }
  });

  return entryPoints;
}

module.exports = {
  entry: getEntryPoints(), // Générer automatiquement les points d'entrée
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
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

