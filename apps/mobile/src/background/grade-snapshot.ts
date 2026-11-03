import type { GradeSnapshot, GradeSnapshotEntry } from '@diary-spo/diary-client'
import type { MarkKeys } from '@diary-spo/shared'

export type ForgottenGrade = {
  day: string
  mark: MarkKeys
  subjectName: string
}

export const parseGradeSnapshot = (
  value: string | null
): GradeSnapshot | null => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<GradeSnapshot>
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.entries == null ||
      typeof parsed.entries !== 'object'
    ) {
      return null
    }
    return parsed as GradeSnapshot
  } catch {
    return null
  }
}

export const forgetOneMark = (
  snapshot: GradeSnapshot
): { forgotten: ForgottenGrade; snapshot: GradeSnapshot } | null => {
  for (const [key, entry] of Object.entries(snapshot.entries)) {
    if (!entry.marks.length) continue

    const marks = entry.marks.slice(0, -1)
    const mark = entry.marks[entry.marks.length - 1]
    const entries: Record<string, GradeSnapshotEntry> = { ...snapshot.entries }

    if (marks.length === 0) delete entries[key]
    else entries[key] = { ...entry, marks }

    return {
      forgotten: {
        day: entry.day,
        mark,
        subjectName: entry.subjectName
      },
      snapshot: { ...snapshot, entries }
    }
  }

  return null
}
