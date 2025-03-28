const path = require('path');
const fs = require('fs');

// Fonction pour détecter automatiquement les fichiers dp*.ts
function getEntryPoints() {
  const displayDir = path.resolve(__dirname, 'src', 'display');
	const textDir = path.resolve(__dirname, 'src', 'text');
  const files = fs.readdirSync(displayDir); // Lire les fichiers du répertoire
	const texts = fs.readdirSync(textDir);
  const entryPoints = {};

  files.forEach((file) => {
    if (file.startsWith('dp') && file.endsWith('.ts')) {
      const name = path.basename(file, '.ts'); // Nom du fichier sans extension
      entryPoints[name] = path.join(displayDir, file); // Chemin complet du fichier
    }
  });
	texts.forEach((file) => {
		if (file.startsWith('txt') && file.endsWith('.ts')) {
			const name = path.basename(file, '.ts');
			entryPoints[name] = path.join(textDir, file);
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

