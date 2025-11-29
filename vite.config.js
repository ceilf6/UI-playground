import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 自动扫描 sandboxs 目录下的所有文件夹，为每个文件夹生成一个入口
function getExampleEntries() {
  const sandboxsDir = path.resolve(__dirname, 'sandboxs');
  const folders = globSync('sandboxs/*/index.html');
  
  const entries = {
    main: path.resolve(__dirname, 'index.html'),
  };

  folders.forEach(file => {
    const folderName = path.basename(path.dirname(file));
    entries[folderName] = path.resolve(__dirname, file);
  });

  return entries;
}

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: getExampleEntries(),
    },
    outDir: 'dist',
  },
  server: {
    port: 8030,
    open: '/',
    middlewareMode: false,
    fs: {
      strict: false,
    },
  },
  appType: 'mpa',
  plugins: [
    react(),
    vue(),
    {
      name: 'sandboxs-auto-entry',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const match = req.url.match(/^\/([^\/\?\.]+)\/?(\?.*)?$/);
          if (match && match[1] !== '' && match[1] !== 'index') {
            const folderName = match[1];
            const query = match[2] || '';
            const folderPath = path.join(__dirname, 'sandboxs', folderName);
            
            // 检查是否存在 index.tsx
            const tsxPath = path.join(folderPath, 'index.tsx');
            const jsxPath = path.join(folderPath, 'index.jsx');
            const vuePath = path.join(folderPath, 'index.vue');
            const htmlPath = path.join(folderPath, 'index.html');
            
            if (fs.existsSync(tsxPath)) {
              // 创建临时入口文件，使用 JSX 语法
              const entryContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './index.tsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`;
              
              const entryPath = path.join(folderPath, '__entry.tsx');
              fs.writeFileSync(entryPath, entryContent);
              
              // 动态生成 HTML
              const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${folderName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/sandboxs/${folderName}/__entry.tsx"></script>
  </body>
</html>`;
              try {
                const transformedHtml = await server.transformIndexHtml(req.url, html);
                res.setHeader('Content-Type', 'text/html');
                res.end(transformedHtml);
              } catch (e) {
                return next(e);
              }
              return;
            } else if (fs.existsSync(jsxPath)) {
              // 创建临时入口文件，使用 JSX 语法
              const entryContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './index.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`;
              
              const entryPath = path.join(folderPath, '__entry.jsx');
              fs.writeFileSync(entryPath, entryContent);
              
              // 动态生成 HTML
              const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${folderName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/sandboxs/${folderName}/__entry.jsx"></script>
  </body>
</html>`;
              try {
                const transformedHtml = await server.transformIndexHtml(req.url, html);
                res.setHeader('Content-Type', 'text/html');
                res.end(transformedHtml);
              } catch (e) {
                return next(e);
              }
              return;
            } else if (fs.existsSync(vuePath)) {
              // 创建临时入口文件，使用 Vue 语法
              const entryContent = `import { createApp } from 'vue';
import App from './index.vue';

createApp(App).mount('#root');`;
              
              const entryPath = path.join(folderPath, '__entry.ts');
              fs.writeFileSync(entryPath, entryContent);
              
              // 动态生成 HTML
              const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${folderName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/sandboxs/${folderName}/__entry.ts"></script>
  </body>
</html>`;
              try {
                const transformedHtml = await server.transformIndexHtml(req.url, html);
                res.setHeader('Content-Type', 'text/html');
                res.end(transformedHtml);
              } catch (e) {
                return next(e);
              }
              return;
            } else if (fs.existsSync(htmlPath)) {
              // 如果有 index.html，使用它
              req.url = `/sandboxs/${folderName}/index.html${query}`;
            }
          }
          next();
        });
      },
    },
  ],
});
