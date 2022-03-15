import config from '../config'
import { nextTick } from '../util'

// activatedChildren: Array<Component>
const activatedChildren = []

export const MAX_UPDATE_COUNT = 100
// Array<Watcher>
const queue = []
// {[key: name]: number}
let has = {}
let waiting = false
let flushing = false
let index = 0

export let currentFlushTimestamp = 0
export function queueActivatedComponent(vm) {
  vm._inactive = false
  activatedChildren.push(vm)
}
const getNow = Date.now
function flushScheduleQueue() {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  queue.sort((a, b) => a.id - b.id)
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) i--
    }
    queue.splice(i + 1, 0, watcher)
  }
  // queue the flush
  if (!waiting) {
    waiting = true
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      flushScheduleQueue()
      return
    }
    nextTick(flushScheduleQueue)
  }
}
