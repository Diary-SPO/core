import { ExaminationType } from 'diary-shared'

export default interface Subject {
  id: string
  name: string
  examinationType: ExaminationType
  marks: Record<string, Record<string, string>>
}
