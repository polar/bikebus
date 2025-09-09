import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


function getPostData(req: any) : Promise<any> {
  return new Promise((resolve, _reject) => {
    let data = "";

    req.on("data", (chunk : any) => {
      data += chunk.toString();
    });

    req.on("end", () => {
      if (!data) {
        resolve({});
      }

      resolve(JSON.parse(data));
    });
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    "host": "0.0.0.0",
    "allowedHosts": ["bikebus.bike","adiron.com"],
      hmr: false,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:9090',
        changeOrigin: false,
        rewrite: (path : string) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", async (proxyReq, req, _res) => {

            if (req.method === 'POST') {
              const requestBody = await getPostData(req);
              console.log("requestBody", requestBody);
            }
            console.log(
                {
                  request: {
                    client: req.socket.address(),
                    method: req.method,
                    url: req.url,
                    requestHeaders: req.headers,
                  },
                  proxyReq: {
                    method: proxyReq.method,
                    protocol: proxyReq.protocol,
                    host: proxyReq.host,
                    path: proxyReq.path,
                    headers: proxyReq.getHeaders()
                  }
                }
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url,
                JSON.stringify(proxyRes.headers),
            );
          });
        },
      },
    },
  },

})
