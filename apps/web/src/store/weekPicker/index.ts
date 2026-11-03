import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

export interface WeekPickerState {
  startDate: Date
  endDate: Date
  isCurrent: boolean
  onSelectWeek: ((start: Date, end: Date) => void) | null
  onCurrentWeek: (() => void) | null
}

const weekPickerStore = createStore<WeekPickerState>({
  initialState: {
    startDate: new Date(),
    endDate: new Date(),
    isCurrent: true,
    onSelectWeek: null,
    onCurrentWeek: null
  }
})

export const useWeekPicker = () => {
  const state = useSyncExternalStore(
    weekPickerStore.subscribe,
    weekPickerStore.getState
  )

  return {
    ...state,
    setWeekPicker: (next: WeekPickerState) => weekPickerStore.setState(next)
  }
}
