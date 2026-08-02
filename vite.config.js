import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        faq: resolve(__dirname, 'faq.html'),
        howItWorks: resolve(__dirname, 'how-it-works/index.html'),
        useCases: resolve(__dirname, 'use-cases.html'),
        webrtcMonitoring: resolve(__dirname, 'webrtc-monitoring.html'),
        openSourceWebrtcMonitoring: resolve(__dirname, 'open-source-webrtc-monitoring.html'),
        observabilityVsAnalytics: resolve(__dirname, 'webrtc-observability-vs-analytics.html'),
        agenticMetrics: resolve(__dirname, 'agentic-webrtc-metrics.html'),
        demo: resolve(__dirname, 'demo/index.html'),
        demoConference: resolve(__dirname, 'demo/conference/index.html'),
        opentelemetry: resolve(__dirname, 'integrations/opentelemetry-webrtc-observability.html'),
        mcpWorkflows: resolve(__dirname, 'integrations/mcp-webrtc-monitoring.html'),
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
