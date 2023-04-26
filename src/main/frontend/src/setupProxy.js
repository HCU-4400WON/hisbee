const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/naver", {
      target: "https://nickname.hwanmoo.kr",
      pathRewrite: {
        "^/naver": "",
      },
      changeOrigin: true,
    })
  );
};
