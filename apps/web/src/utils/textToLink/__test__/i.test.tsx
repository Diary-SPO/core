import { describe, expect, it } from 'bun:test'
import { textToLink } from '@utils'
import { mockTextWithLinks } from './mocs.ts'

/** textToLink **/
describe('textToLink', () => {
  it('should convert text with links into Link components', () => {
    const result = textToLink(mockTextWithLinks)

    expect(Array.isArray(result)).toBe(true)

    result.forEach((part) => {
      if (typeof part === 'string') {
        expect(part).not.toMatch(/https?:\/\/\S+/)
      } else {
        expect(part.props.href).toBe('https://www.example.com.')
        expect(part.props.target).toBe('_blank')
      }
    })
  })
})
