import {
  Grade,
  type MarkKeys,
  type PerformanceCurrent
} from '@diary-spo/shared'

export interface GradeSnapshotEntry {
  day: string
  marks: MarkKeys[]
  subjectName: string
}

export interface GradeSnapshot {
  entries: Record<string, GradeSnapshotEntry>
  version: 1
}

export type GradeChange =
  | (GradeSnapshotEntry & { mark: MarkKeys; type: 'ADD' })
  | (GradeSnapshotEntry & { mark: MarkKeys; type: 'DELETE' })
  | (GradeSnapshotEntry & {
      mark: MarkKeys
      previousMark: MarkKeys
      type: 'UPDATE'
    })

const entryKey = (subjectName: string, day: string) =>
  JSON.stringify([subjectName, day])

const normalizeDay = (day: Date | string): string =>
  (day instanceof Date ? day.toISOString() : String(day)).slice(0, 10)

const sortedMarks = (marks: MarkKeys[]) => [...marks].sort()

export const createGradeSnapshot = (
  performance: PerformanceCurrent
): GradeSnapshot => {
  const entries: Record<string, GradeSnapshotEntry> = {}

  for (const subject of performance.daysWithMarksForSubject) {
    for (const dayWithMarks of subject.daysWithMarks ?? []) {
      const day = normalizeDay(dayWithMarks.day)
      entries[entryKey(subject.subjectName, day)] = {
        day,
        marks: sortedMarks(dayWithMarks.markValues),
        subjectName: subject.subjectName
      }
    }
  }

  return { entries, version: 1 }
}

const subtractMarks = (source: MarkKeys[], valuesToRemove: MarkKeys[]) => {
  const result = [...source]

  for (const value of valuesToRemove) {
    const index = result.indexOf(value)
    if (index !== -1) result.splice(index, 1)
  }

  return result
}

const commonMarks = (first: MarkKeys[], second: MarkKeys[]) => {
  const available = [...second]
  const common: MarkKeys[] = []

  for (const mark of first) {
    const index = available.indexOf(mark)
    if (index === -1) continue

    common.push(mark)
    available.splice(index, 1)
  }

  return common
}

export const diffGradeSnapshots = (
  previous: GradeSnapshot,
  current: GradeSnapshot
): GradeChange[] => {
  const changes: GradeChange[] = []
  const keys = new Set([
    ...Object.keys(previous.entries),
    ...Object.keys(current.entries)
  ])

  for (const key of keys) {
    const previousEntry = previous.entries[key]
    const currentEntry = current.entries[key]
    const entry = currentEntry ?? previousEntry

    if (!entry) continue

    const unchanged = commonMarks(
      previousEntry?.marks ?? [],
      currentEntry?.marks ?? []
    )
    const removed = subtractMarks(previousEntry?.marks ?? [], unchanged)
    const added = subtractMarks(currentEntry?.marks ?? [], unchanged)
    const updatedCount = Math.min(removed.length, added.length)

    for (let index = 0; index < updatedCount; index++) {
      changes.push({
        ...entry,
        mark: added[index],
        previousMark: removed[index],
        type: 'UPDATE'
      })
    }

    for (const mark of added.slice(updatedCount)) {
      changes.push({ ...entry, mark, type: 'ADD' })
    }

    for (const mark of removed.slice(updatedCount)) {
      changes.push({ ...entry, mark, type: 'DELETE' })
    }
  }

  return changes
}

const displayMark = (mark: MarkKeys) => String(Grade[mark] ?? mark)

const markIcon = (mark: MarkKeys) =>
  ({
    '': '📘',
    Five: '5️⃣',
    Four: '4️⃣',
    Success: '✅',
    Three: '3️⃣',
    Two: '2️⃣'
  })[mark]

const displayDay = (day: string) => {
  const [year, month, date] = day.split('-')
  return date && month && year ? `${date}.${month}.${year}` : day
}

export const formatGradeNotification = (change: GradeChange) => {
  const place = `${change.subjectName}, ${displayDay(change.day)}`

  if (change.type === 'UPDATE') {
    return {
      body: `${displayMark(change.previousMark)} → ${displayMark(change.mark)} · ${place}`,
      title: `${markIcon(change.mark)} Оценка изменена`
    }
  }

  return {
    body: `${displayMark(change.mark)} · ${place}`,
    title:
      change.type === 'ADD'
        ? `${markIcon(change.mark)} Новая оценка`
        : `❌ Оценка ${displayMark(change.mark)} удалена`
  }
}
