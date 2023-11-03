interface TStore<T> {
  initialState: T
}

const createStore = <T>({ initialState }: TStore<T>) => {
  type State = T
  type ListenerCallback = () => void

  const store = {
    state: initialState,
    setState: (newValue: State) => {
      store.state = newValue
      store.listeners.forEach((listener) => listener())
    },
    getState: (): State => store.state,
    listeners: new Set<ListenerCallback>(),
    subscribe: (cb: ListenerCallback) => {
      store.listeners.add(cb)
      return () => {
        store.listeners.delete(cb)
      }
    },
  }

  return store
}

export default createStore
