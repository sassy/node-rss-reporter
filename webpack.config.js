module.exports = {
    entry: './src/main.ts',
    target: 'node',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['ts-loader'],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.js' ]
    }
  };