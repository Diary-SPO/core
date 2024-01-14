import { Task } from '@diary-spo/shared'
import { useSyncExternalStore } from 'react'
import { createStore } from './index.ts'

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

const useMarkModal = () => {
  const modal = useSyncExternalStore(modalStore.subscribe, modalStore.getState)

  return {
    modalData: modal,
    setData: (data: ModalProps) => modalStore.setState(data)
  }
}

export default useMarkModal
