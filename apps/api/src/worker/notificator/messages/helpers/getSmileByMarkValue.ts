import type { AdditionalMarks } from '@diary-spo/shared'

const emojis: Record<AdditionalMarks | number, string> = {
  5: '5️⃣',
  4: '4️⃣',
  3: '3️⃣',
  2: '2️⃣',
  Зч: 'Зч 🥳',
  Д: 'Д 🫡'
}

export const getSmileByMarkValue = (mark: AdditionalMarks | number) =>
  emojis[mark]
