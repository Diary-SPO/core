import { lazy } from 'preact/compat'
import { PerformanceCurrent } from '@diary-spo/shared'

import { Suspense } from '@components'
import { Tabs } from '../types.ts'

const Summary = lazy(() => import('../Tabs/Summary'))
const FinalMarks = lazy(() => import('../Tabs/FinalMarks'))
const MarksByGroup = lazy(() => import('../Tabs/MarksByGroup'))
const SubjectsList = lazy(() => import('../Tabs/SubjectsList'))

export const useActiveTab = (
  selected: Tabs,
  totalNumberOfMarks: number | null,
  averageMark: number | null,
  markCounts: Record<number, number> | null,
  marksForSubject: PerformanceCurrent | null,
  setIsError: (value: boolean) => void,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void
) => {
  let activeTabComponent = null

  switch (selected) {
    case 'summary':
      activeTabComponent = (
        <Suspense id='UserInfo'>
          <Summary
            totalNumberOfMarks={totalNumberOfMarks}
            averageMark={averageMark}
            markCounts={markCounts}
          />
        </Suspense>
      )
      break
    case 'current':
      activeTabComponent = (
        <Suspense id='MarksByGroup'>
          <MarksByGroup marksForSubject={marksForSubject} />
        </Suspense>
      )
      break
    case 'finalMarks':
      activeTabComponent = (
        <Suspense id='FinalMarks'>
          <FinalMarks
            setIsError={setIsError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Suspense>
      )
      break
    case 'attestation':
      activeTabComponent = (
        <Suspense id='AttestationTab'>
          <SubjectsList
            setIsError={setIsError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Suspense>
      )
      break
    default:
      break
  }

  return <main className='activeTabWrapper'>{activeTabComponent}</main>
}
