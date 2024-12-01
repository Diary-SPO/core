import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

interface ModalProps {
  id: string
}

// TODO: add data
const modalStore = createStore<ModalProps>({
  initialState: {
    id: ''
  }
})

export const useMarketFiltersModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modalData: modal,
    setData: (data: ModalProps) => modalStore.setState(data)
  }
}
