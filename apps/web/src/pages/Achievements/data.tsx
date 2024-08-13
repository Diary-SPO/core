import {
  Icon28EducationOutline,
  Icon28GridSquareOutline,
  Icon28TextViewfinderOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons'
import type { ReactNode } from 'preact/compat'
import type { Tabs } from './types.ts'

interface DataType {
  icon: ReactNode
  type: Tabs
  text: string
}
export const data: DataType[] = [
  {
    icon: <Icon28UserCircleOutline />,
    type: 'summary',
    text: 'Общее'
  },
  {
    icon: <Icon28GridSquareOutline />,
    type: 'current',
    text: 'Текущие'
  },
  {
    icon: <Icon28EducationOutline />,
    type: 'finalMarks',
    text: 'Итоговые'
  },
  {
    icon: <Icon28TextViewfinderOutline />,
    type: 'attestation',
    text: 'Ведомость'
  }
]
