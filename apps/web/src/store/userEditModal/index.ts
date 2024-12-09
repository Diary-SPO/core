import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

interface ModalProps {
  setAvatarFilename: (name: string|null) => void
}

// TODO: add data
const modalStore = createStore<ModalProps>({
  initialState: {
    setAvatarFilename: (name) => null
  }
})

export const useUserEditModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modalData: modal,
    setData: (data: ModalProps) => modalStore.setState(data)
  }
}
