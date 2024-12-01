import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

interface ModalProps {
  name: string
}

// TODO: add data
const modalStore = createStore<ModalProps>({
  initialState: {
    name: ''
  }
})

export const useUserEditModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modalData: modal,
    setData: (data: ModalProps) => modalStore.setState(data)
  }
}
