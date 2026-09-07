import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ru.diaryspo.mobile',
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
      label: 'ru.diaryspo.mobile.grade-check',
      repeat: true,
      src: 'runners/grade-runner.js'
    }
  }
}

export default config
