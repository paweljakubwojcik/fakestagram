/**
 * util for looping trough async functions
 * forEach but you can await it
 */
export const asyncForEach = async <T>(arr: T[], callback: (elem: T, index: number, arr: T[]) => Promise<any>) => {
  await Promise.all(
    arr.map((...args) => {
      return new Promise<void>(async (res) => {
        await callback(...args)
        res()
      })
    })
  )
}
