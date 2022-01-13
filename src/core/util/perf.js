import { inBrowser } from './env'

export let mark
export let measure
// 利用performanceApi测试性能
if (process.env.NODE_ENV !== 'production') {
  const perf = inBrowser && window.performance

  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = (tag) => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
    }
  }
}
