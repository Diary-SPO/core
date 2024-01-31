import { Lesson } from '@diary-spo/shared'
import { createStore } from '@store'
import { useSyncExternalStore } from 'react'
import { cleanData } from './data.ts'

const modalStore = createStore<Lesson>({ initialState: cleanData })

const useModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modal,
    setData: (data: Lesson) => modalStore.setState(data)
  }
}

export default useModal
