import { defineConfig } from '../../web/node_modules/vite/dist/vite/node/index.js';
import react from '../../web/node_modules/@vitejs/plugin-react/dist/index.js';
import tailwind from '../../web/node_modules/@tailwindcss/vite/dist/index.mjs';
import { fileURLToPath } from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),publicDir:'../../web/public',plugins:[react(),tailwind()],resolve:{alias:{'@':fileURLToPath(new URL('../../web/src',import.meta.url)),react:fileURLToPath(new URL('../../web/node_modules/react',import.meta.url)),'react-dom':fileURLToPath(new URL('../../web/node_modules/react-dom',import.meta.url))}},server:{host:'127.0.0.1',port:4310,fs:{allow:[fileURLToPath(new URL('../../../',import.meta.url))]}}});
