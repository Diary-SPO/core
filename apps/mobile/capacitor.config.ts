import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.github.diaryspo',
  appName: 'Дневник СПО',
  webDir: 'dist',
  android: {
    allowMixedContent: false
  },
  plugins: {
    BackgroundRunner: {
      autoStart: true,
      event: 'gradeCheck',
      interval: 15,
      label: 'io.github.diaryspo.grade-check',
      repeat: true,
      src: 'runners/grade-runner.js'
    },
    CapacitorUpdater: {
      // Каналы и UI обновлений ведём сами; в Capgo cloud не ходим.
      autoUpdate: false,
      appReadyTimeout: 15000,
      statsUrl: '',
      updateUrl: '',
      channelUrl: ''
    }
  }
}

export default config
