import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Lesson } from 'diary-shared'

interface LessonState {
  lessonModalData: Lesson | null
}

const initialState: LessonState = {
  lessonModalData: null,
}

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    setLessonModalData: (state, action: PayloadAction<Lesson | null>) => {
      state.lessonModalData = action.payload
    },
  },
})

export const { setLessonModalData } = lessonSlice.actions
export const selectLessonModalData = (state: { lesson: LessonState }) =>
  state.lesson.lessonModalData
export default lessonSlice.reducer
