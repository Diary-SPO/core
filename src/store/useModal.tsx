import { useSyncExternalStore } from 'react'
import { Lesson } from 'diary-shared'
import { cleanData } from '../modals/data'
import createStore from './index'

const modalStore = createStore<Lesson>({ initialState: cleanData })

const useModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modal,
    setData: (data: Lesson) => modalStore.setState(data),
  }
}

export default useModal
