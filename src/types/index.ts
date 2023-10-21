export type Pages = 'schedule' | 'contacts' | 'marks' | 'settings' | 'attestation' | 'notifications';

export interface Storage {
  key: string;
  value: string
}

/**
 * FIXME: enum стал страшный и в целом enum многие по понятным причинам хейтят
 * Поэтому когда-нибудь надо пофиксить
*/
export enum Grade {
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
  One = 1,
  // Оценка пустая = долг, двойку не ставим!
  '' = 'Д',
  'Н' = 'Н',
  // Кастыль :))
  'Д' = 'Д',
  'ДЗ' = 'ДЗ',
  'О' = 'О',
}

export type GradeKeys = keyof typeof Grade;

export type TextMark = GradeKeys;
export type TMark = typeof Grade[GradeKeys];
