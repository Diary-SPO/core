import { useSyncExternalStore } from 'react'
import { createStore } from '../store'

interface StorageInspectState {
  key: string
  value: string
}

const storageInspectStore = createStore<StorageInspectState>({
  initialState: {
    key: '',
    value: ''
  }
})

export const useStorageInspect = () => {
  const state = useSyncExternalStore(
    storageInspectStore.subscribe,
    storageInspectStore.getState
  )

  return {
    ...state,
    openStorageInspect: (key: string, value: string) =>
      storageInspectStore.setState({ key, value }),
    clearStorageInspect: () =>
      storageInspectStore.setState({ key: '', value: '' })
  }
}
