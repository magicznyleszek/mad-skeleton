module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {
            browsers: '> 5%'
        },
        cssnano: {
            autoprefixer: false
        }
    }
};
