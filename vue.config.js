// vue.config.js
const path = require('path')

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/sass/styles.scss";
        `
      }
    }
  },
  runtimeCompiler: true
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/sass/styles.scss'),
      ],
    })
}