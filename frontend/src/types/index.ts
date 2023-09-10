export type Pages = 'schedule' | 'contacts' | 'marks' | 'settings' | 'attestation';

export interface Storage {
  key: string;
  value: string
}
