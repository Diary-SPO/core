import { api } from '../../api.ts'

export const getFinalMarks = async () => api['final.marks'].get()
