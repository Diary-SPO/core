import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ru.diaryspo.mobile',
  appName: 'Дневник СПО',
  webDir: 'dist',
  android: {
    allowMixedContent: false
  }
}

export default config
