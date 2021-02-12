// Work around for https://github.com/angular/angular-cli/issues/7200

const path = require('path');
const webpack = require('webpack');

const externals = [
    'firebase-admin',
    'firebase-functions',
    'firebase-app',
    'sharp'
];
module.exports = {

    mode: 'none',
    entry: {
        // This is our Express server for Dynamic universal
        server: './server.ts'
    },
    target: 'node',
    resolve: { extensions: ['.ts', '.js'] },
    optimization: {
        minimize: true
    },
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: 'app',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },

        ]
    },
    plugins: [
        
        new webpack.DefinePlugin({
            Event: JSON.stringify(true),

        })
    ],
    externals: externals.reduce(
        (acc, name) => Object.assign({}, acc, { [name]: true }),
        {}
    ),
};
