import type { Task } from '@diary-spo/shared'
import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

interface ModalProps {
  data: Task
  lessonName: string
}

// TODO: add data
const modalStore = createStore<ModalProps>({
  initialState: {
    lessonName: 'sat',
    data: {
      topic: '',
      mark: '',
      type: '',
      isRequired: false,
      id: 1,
      attachments: []
    }
  }
})

export const useMarkModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modalData: modal,
    setData: (data: ModalProps) => modalStore.setState(data)
  }
}
