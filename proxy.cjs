const http = require('http');

function createProxy(port, targetPort) {
  const server = http.createServer((req, res) => {
    const options = {
      hostname: '127.0.0.1',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    proxyReq.on('error', () => {
      res.writeHead(502);
      res.end('Bad gateway');
    });
    req.pipe(proxyReq, { end: true });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Port ${port} proxying to ${targetPort}`);
  });
  return server;
}

createProxy(5174, 5175);
createProxy(5173, 5175);
