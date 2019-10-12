/*global require __dirname module*/
const path = require('path');

let conf = {
    entry: "./source/js/main.js", // string | object | array
    // defaults to './src'
    // Here the application starts executing
    // and webpack starts bundling
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, "dist/js"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "build.js", // string
        // the filename template for entry chunks
        publicPath: "/dist/", // string
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    }
};

module.exports = (env, options) => {
    conf.devtool = options.mode === "production" ?
        false :
        "cheap-module-eval-source-map";

    return conf;
};