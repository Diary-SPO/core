import { useSyncExternalStore } from 'react'

import { DEFAULT_DIARY_URL } from '../../shared/config'
import { createStore } from '../store'

interface DiaryRegionState {
  selectedUrl: string
}

const SELECTED_STORAGE_KEY = 'diaryUrl'

const readStoredSelection = (): string => {
  try {
    return localStorage.getItem(SELECTED_STORAGE_KEY) || DEFAULT_DIARY_URL
  } catch {
    return DEFAULT_DIARY_URL
  }
}

const regionStore = createStore<DiaryRegionState>({
  initialState: {
    selectedUrl: readStoredSelection()
  }
})

export const useDiaryRegion = () => {
  const state = useSyncExternalStore(
    regionStore.subscribe,
    regionStore.getState
  )

  return {
    selectedUrl: state.selectedUrl,
    selectRegion: (url: string) => {
      try {
        localStorage.setItem(SELECTED_STORAGE_KEY, url)
      } catch {
        // localStorage может быть недоступен - выбор просто не сохранится
      }
      regionStore.setState({ selectedUrl: url })
    }
  }
}
