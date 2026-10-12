import type { AbsenceType, Task } from '@diary-spo/shared'
import { useSyncExternalStore } from 'react'
import type { ReturnedMark } from '../../shared/types.ts'
import { createStore } from '../store'

interface ModalProps {
  data: Task | null
  lessonName: string
  lessonDate?: string
  lessonTime?: string
  dateISO?: string
  lessonIndex?: number
  absenceType?: AbsenceType
  fallbackMark?: ReturnedMark | null
  isLoading?: boolean
  loadError?: boolean
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
