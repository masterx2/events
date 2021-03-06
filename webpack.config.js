module.exports = {
    entry: {
        events: './src/events.js',
    },
    output: {
        path: './dist/',
        filename: '[name].js',
        library: 'Events'
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