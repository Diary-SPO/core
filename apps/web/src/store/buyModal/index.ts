import type {AvatarData, Nullable} from '@diary-spo/shared'
import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

interface ModalProps {
  avatar: Nullable<AvatarData>
  balance: Nullable<number>
  setBalance: (balance: number) => void
}

// TODO: add data
const modalStore = createStore<ModalProps>({
  initialState: {
    avatar: null,
    balance: null,
    setBalance: (balance: number) => null
  }
})

export const useBuyModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modalData: modal,
    setData: (data: ModalProps) => modalStore.setState(data)
  }
}
