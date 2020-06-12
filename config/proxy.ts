/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  // 测试
  dev: {
    '/api/': {
      target: 'https://dev.tc-etc.cn/test',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/gas_mini/': {
      target: 'https://dev.tc-etc.cn/test',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // 预发布
  pre: {
    '/api/': {
      target: 'https://xpapi.cyui.cn/test',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // 正式
  prod: {
    '/api/': {
      target: 'https://lsh.tc-etc.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // 使用https://preview.pro.ant.design中的api
  design: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
