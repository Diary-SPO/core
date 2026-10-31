import { publicUrl } from './site'

/** Герб региона (webp). */
export function regionEmblemUrl(id: string): string {
  return publicUrl(`regions/emblems/${id}.webp`)
}

/** Фото региона для hero (webp). */
export function regionPhotoUrl(id: string): string {
  return publicUrl(`regions/photos/${id}.webp`)
}

/** Уменьшенное фото для карточек списка (webp). */
export function regionThumbUrl(id: string): string {
  return publicUrl(`regions/thumbs/${id}.webp`)
}
