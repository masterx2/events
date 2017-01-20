module.exports = {
    entry: {
        events: './src/events.js',
    },
    output: {
        path: './dist/',
        filename: '[name].js',
        libraryTarget: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }],
            }
        ]
    }
};