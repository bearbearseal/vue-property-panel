module.exports = {
    devServer: {
        proxy: {
            '/post_handler': {
                target: 'http://localhost:8081',
                changeOrigin: true, // 解决跨域
            },
        },
    },
  };