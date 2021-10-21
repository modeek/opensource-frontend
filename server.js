/* eslint-disable no-console */
const express = require("express");
const next = require("next");

// const devProxy = {
// 	'/api': {
// 		target: 'https://web.myflow.app/',
// 		pathRewrite: { '^/prod': '/' },
// 		changeOrigin: true,
// 	},
// };
const cors = require("cors");

const port = parseInt(process.env.PORT, 10) || 3000;
const env = process.env.NODE_ENV;
const dev = env !== "production";
const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

let server;

app
  .prepare()
  .then(() => {
    server = express();

    // server.use(
    // 	cors({
    // 		methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    // 		preflightContinue: false,
    // 		allowedHeaders: ['workflowToken', 'WorkflowToken', 'WORKFLOWTOKEN', 'workflowtoken'],
    // 		origin: '*',
    // 	})
    // );

    // server.use((req, res, next) => {
    // 	res.setHeader('Access-Control-Allow-Origin', '*');
    // 	res.setHeader('Access-Control-Allow-Credentials', 'true');
    // 	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    // 	res.setHeader('Access-Control-Allow-Headers', 'Accept');
    // 	next();
    // });

    server.use(function (req, res, next) {
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, workflowToken"
      );
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self' sheesha.app *.sheesha.app vitals.vercel-insights.com 5rt9fhw2qb.execute-api.us-east-1.amazonaws.com"
      );
      res.header(
        "Content-Security-Policy",
        "default-src 'self' sheesha.app *.sheesha.app 5rt9fhw2qb.execute-api.us-east-1.amazonaws.com"
      );
      next();
    });

    // Set up the proxy.
    // if (devProxy) {
    // 	const proxyMiddleware = require('http-proxy-middleware');
    // 	Object.keys(devProxy).forEach(function(context) {
    // 		server.use(proxyMiddleware(context, devProxy[context]));
    // 	});
    // }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => {
      req.headers["Access-Control-Allow-Headers"] = "*";
      res.setHeader("X-Powered-By", "lol");
      handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });
