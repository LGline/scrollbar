

module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
    ? '/production-sub-path/'
    : '/',
  productionSourceMap: false,
	lintOnSave: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
}