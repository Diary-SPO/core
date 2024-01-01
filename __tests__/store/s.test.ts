import { describe, expect, it } from 'vitest'
import createStore from '../../src/store'

describe('store', () => {
  it('устанавляет начальное состояние', () => {
    /**
     * Тест проверяет, устанавливает ли функция createStore начальное состояние.
     * Создается store с заданным начальным состоянием, затем используется функция getState,
     * чтобы проверить, соответствует ли текущее состояние начальному.
     */

    const initialState = { count: 0 }
    const store = createStore({ initialState })
    const state = store.getState()

    expect(state).toEqual(initialState)
  })

  it('обновляет состояние и уведомляет слушателей', () => {
    /**
     * Тест проверяет, обновляет ли функция setState состояние и уведомляет ли слушателей.
     * Создается store с начальным состоянием. Подписывается слушатель через функцию subscribe,
     * затем устанавливается новое состояние через setState.
     *
     * Проверяется, обновилось ли состояние, и вызвался ли слушатель (callback),
     * указывающий на уведомление о изменении состояния.
     */

    const initialState = { count: 0 }
    const store = createStore({ initialState })

    let callbackCalled = false
    const unsubscribe = store.subscribe(() => {
      callbackCalled = true
    })

    const newState = { count: 1 }
    store.setState(newState)

    expect(store.getState()).toEqual(newState)
    expect(callbackCalled).toEqual(true)

    unsubscribe()
  })

  it('подписывает и отписывает слушателей', () => {
    /**
     * Тест проверяет корректность процесса подписки и отписки слушателей от изменений состояния.
     * Создается store с начальным состоянием. Подписывается слушатель на изменения состояния через функцию subscribe,
     * затем устанавливается новое состояние через setState.
     *
     * Проверяется, вызвался ли слушатель после установки нового состояния,
     * затем слушатель отписывается и проверяется, что при установке следующего состояния слушатель не вызывается.
     */

    const initialState = { count: 0 }
    const store = createStore({ initialState })

    let callbackCalled = false
    const listener = () => {
      callbackCalled = true
    }

    const unsubscribe = store.subscribe(listener)
    store.setState({ count: 1 })

    expect(callbackCalled).toEqual(true)

    callbackCalled = false
    unsubscribe()

    store.setState({ count: 2 })
    expect(callbackCalled).toEqual(false)
  })
})
