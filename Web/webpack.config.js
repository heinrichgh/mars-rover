const path = require("path");

module.exports = {
    entry: "./www/src/index.ts",
    output: {
        path: path.resolve(__dirname, "wwwroot/dist"),
        filename: "index.js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    }
};