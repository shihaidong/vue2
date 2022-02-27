import { makeMap } from '@/core/util'

export const isReservedAttr = makeMap('style,class')

const acceptValue = makeMap('input,textarea,options,select,progress')

export const mustUseProp = (tag, type, attr) => {
  return (
    (attr === 'value' && acceptValue(tag) && type !== 'button') ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
}
