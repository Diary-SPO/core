import type { PerformanceCurrent } from '@diary-spo/shared'

import type { Tabs } from '../types.ts'

import FinalMarks from '../Tabs/FinalMarks'
import MarksByGroup from '../Tabs/MarksByGroup'
import SubjectsList from '../Tabs/SubjectsList'
import Summary from '../Tabs/Summary'

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
  switch (selected) {
    case 'summary':
      return (
        <Summary
          totalNumberOfMarks={totalNumberOfMarks}
          averageMark={averageMark}
          markCounts={markCounts}
        />
      )
    case 'current':
      // TODO: fix
      return <MarksByGroup marksForSubject={marksForSubject} />
    case 'finalMarks':
      return (
        <FinalMarks
          setIsError={setIsError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )
    case 'attestation':
      return (
        <SubjectsList
          setIsError={setIsError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )
    default:
      return null
  }
}
