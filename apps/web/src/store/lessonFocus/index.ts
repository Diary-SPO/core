import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

export interface LessonFocus {
  dateISO: string
  lessonIndex: number
  nonce: number
}

const focusStore = createStore<{ focus: LessonFocus | null }>({
  initialState: { focus: null }
})

export const useLessonFocus = () => {
  const { focus } = useSyncExternalStore(
    focusStore.subscribe,
    focusStore.getState
  )

  return {
    focus,
    focusOn: (dateISO: string, lessonIndex: number) =>
      focusStore.setState({
        focus: { dateISO, lessonIndex, nonce: Date.now() }
      }),
    clearFocus: () => focusStore.setState({ focus: null })
  }
}
