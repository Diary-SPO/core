import { publicUrl } from './site'

/** Герб региона в webp */
export function regionEmblemUrl(id: string): string {
  return publicUrl(`regions/emblems/${id}.webp`)
}

/** Фото региона для hero в webp */
export function regionPhotoUrl(id: string): string {
  return publicUrl(`regions/photos/${id}.webp`)
}

/** Уменьшенное фото для карточек списка в webp */
export function regionThumbUrl(id: string): string {
  return publicUrl(`regions/thumbs/${id}.webp`)
}
