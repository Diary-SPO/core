export type Pages = 'schedule' | 'contacts' | 'projects' | 'settings';

export interface Storage {
  key: string;
  value: string
}

export enum Grade {
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
  One = 1,
}

export type TextMarks = 'Five' | 'Four' | 'Three' | 'Two' | 'One';
