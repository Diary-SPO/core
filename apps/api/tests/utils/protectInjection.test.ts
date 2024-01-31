// TODO: REMOVE IT (folder 'test' as well)
import { expect, test } from 'bun:test'
import { protectInjection } from '../../src/utils/protectInjection'

test('Проверка при вводе utf-8 кавычек', () => {
  const testString = "''''" + '"""""""' + '```````'
  const succResultString = ''
  const factResultString = protectInjection(testString)
  expect(factResultString).toBe(succResultString)
})

test("Проверка при вводе sql инъекции с кавычкой '", () => {
  const testString = "'; DROP DATABASE diaryUser;"
  const succResultString = '; DROP DATABASE diaryUser;'
  const factResultString = protectInjection(testString)
  expect(factResultString).toBe(succResultString)
})

test('Проверка при вводе sql инъекции с кавычкой "', () => {
  const testString = '"; DROP DATABASE diaryUser;'
  const succResultString = '; DROP DATABASE diaryUser;'
  const factResultString = protectInjection(testString)
  expect(factResultString).toBe(succResultString)
})

test('Проверка при вводе sql инъекции с кавычкой `', () => {
  const testString = '`; DROP DATABASE diaryUser;'
  const succResultString = '; DROP DATABASE diaryUser;'
  const factResultString = protectInjection(testString)
  expect(factResultString).toBe(succResultString)
})

test('Проверка при вводе в формате utf-8 в трудноразличимой форме', () => {
  const testString =
    '\u0027\u003c\u002d\u042d\u0442\u043e\u0020\u043a\u0430\u0432\u044b\u0447\u043a\u0430'
  const succResultString = '<-Это кавычка'
  const factResultString = protectInjection(testString)
  expect(factResultString).toBe(succResultString)
})

test('Проверка при вводе в формате ASCII', () => {
  const testString =
    '&#39;&#60;&#45;&#1069;&#1090;&#1086;&#32;&#1082;&#1072;&#1074;&#1099;&#1095;&#1082;&#1072;'
  const factResultString = protectInjection(testString)
  expect(factResultString.indexOf("'")).toBe(-1)
})
