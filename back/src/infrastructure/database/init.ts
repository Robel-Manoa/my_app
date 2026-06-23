import { runAllSeeds } from './seed'

let initialized = false

export async function initializeMemoryDatabase() {
  if (initialized) {
    return
  }

  initialized = true
  await runAllSeeds()
}
