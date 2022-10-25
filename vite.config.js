import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.', 'src'),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 80,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:3000',
    //   }
    // }
  },
  css: {
    preprocessorOptions: {
        less: {
            additionalData: `@import '@/style/global.less';` // 配置全局样式 
        }
    }
},
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) { // 切割打包，减少打包体积
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }
      }
    }
  }
})
