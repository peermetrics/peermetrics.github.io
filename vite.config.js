import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        livekit: resolve(__dirname, 'integrations/livekit.html'),
        mediasoup: resolve(__dirname, 'integrations/mediasoup.html'),
        janus: resolve(__dirname, 'integrations/janus.html'),
        vonage: resolve(__dirname, 'integrations/vonage.html'),
        agora: resolve(__dirname, 'integrations/agora.html'),
        pion: resolve(__dirname, 'integrations/pion.html'),
        jitsi: resolve(__dirname, 'integrations/jitsi.html')
      }
    }
  },
  server: {
    host: true,
  },
})
