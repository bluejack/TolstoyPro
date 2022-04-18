const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const exec = require('child_process').exec;

require('dotenv').config();

module.exports = (env) => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        hash: true,
        title: 'TolstoyPro',
        metaDesc: 'Tolstoy Pro: the Professional Writer\'s App',
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body'
      }),
      new HtmlWebpackPlugin({
        title: 'TolstoyPro',
        metaDesc: 'Tolstoy Pro: the Professional Writer\'s App',
        template: './src/error.html',
        filename: 'error.html'
      }),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            exec(`aws s3 sync dist/ ${process.env.S3_BUCKET}`, (err, stdout, stderr) => {
              if (err) console.log(err);
              if (stdout) process.stdout.write(stdout);
              if (stderr) process.stderr.write(stderr);
            });
          });
        }
      }
    ],
    mode: process.env.BUILD_MODE,
    performance: {
      hints: false
    },
    output: {
      clean: true
    }
  };
};


