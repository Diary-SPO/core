import { useSyncExternalStore } from 'react'

import { DEFAULT_DIARY_URL } from '../../shared/config'
import { createStore } from '../store'

export type DiaryGeoStatus = 'idle' | 'loading' | 'ready' | 'failed'

interface DiaryRegionState {
  selectedUrl: string
  suggestedUrl: string | null
  geoStatus: DiaryGeoStatus
}

const SELECTED_STORAGE_KEY = 'diaryUrl'
const MANUAL_STORAGE_KEY = 'diaryUrlManual'

const readStoredSelection = (): {
  selectedUrl: string
  isManual: boolean
} => {
  try {
    const storedUrl = localStorage.getItem(SELECTED_STORAGE_KEY)
    const isManual = localStorage.getItem(MANUAL_STORAGE_KEY) === '1'
    return { selectedUrl: storedUrl || DEFAULT_DIARY_URL, isManual }
  } catch {
    return { selectedUrl: DEFAULT_DIARY_URL, isManual: false }
  }
}

const initialSelection = readStoredSelection()

const regionStore = createStore<DiaryRegionState>({
  initialState: {
    selectedUrl: initialSelection.selectedUrl,
    suggestedUrl: null,
    geoStatus: 'idle'
  }
})

const persistSelection = (url: string, isManual: boolean) => {
  try {
    localStorage.setItem(SELECTED_STORAGE_KEY, url)
    if (isManual) {
      localStorage.setItem(MANUAL_STORAGE_KEY, '1')
    }
  } catch {
    // localStorage может быть недоступен — выбор просто не сохранится
  }
}

export const useDiaryRegion = () => {
  const state = useSyncExternalStore(
    regionStore.subscribe,
    regionStore.getState
  )

  return {
    selectedUrl: state.selectedUrl,
    suggestedUrl: state.suggestedUrl,
    geoStatus: state.geoStatus,
    selectRegion: (url: string) => {
      persistSelection(url, true)
      regionStore.setState({ ...regionStore.getState(), selectedUrl: url })
    },
    setGeoLoading: () => {
      regionStore.setState({ ...regionStore.getState(), geoStatus: 'loading' })
    },
    setGeoSuggestion: (url: string | null) => {
      const current = regionStore.getState()
      const { isManual } = readStoredSelection()
      const shouldAutoApply = Boolean(url) && !isManual

      if (url && shouldAutoApply) {
        persistSelection(url, false)
      }

      regionStore.setState({
        selectedUrl: shouldAutoApply && url ? url : current.selectedUrl,
        suggestedUrl: url,
        geoStatus: 'ready'
      })
    },
    setGeoFailed: () => {
      regionStore.setState({ ...regionStore.getState(), geoStatus: 'failed' })
    }
  }
}
