import type { Lesson } from '@diary-spo/shared'
import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

const modalStore = createStore<Lesson>({ initialState: undefined })

export const useLessonModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modal,
    setData: (data: Lesson) => modalStore.setState(data)
  }
}
