export function debounce<T>(action: (arg: T) => Promise<void>) {
  const marker = Symbol()
  let run = false
  let next: T | typeof marker = marker
  const process = () => {
    if (next !== marker && !run) {
      const realArg = next
      next = marker
      run = true
      action(realArg).then(() => {
        run = false
        process()
      })
    }
  }
  return (arg: T) => {
    next = arg
    process()
  }
}
