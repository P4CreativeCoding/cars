const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/Game.ts', // this is your main TypeScript file
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.m?js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"], // ensure compatibility with older browsers
                        plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
                    },
                },
            },
            // {
            //     test: /\.js$/,
            //     loader: "webpack-remove-debug", // remove "debug" package
            // },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules')
        ],
        // root: path.resolve('./src'),
        // alias: {
        //     src: path.resolve(__dirname + '/src')
        // }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000
    },
    plugins: [
        // copy assets to dist folder
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/assets', to: 'assets'},
                {from: 'src/index.html', to: 'index.html'},
            ],
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // the output directory
    },
};

