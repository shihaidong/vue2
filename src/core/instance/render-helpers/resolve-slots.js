import VNode from '../../vdom/vnode'

/**
 * @param {Array<VNode} children
 * @param {Component} context
 * @returns { [key: string]: Array<VNode> }
 */
export function resolveSlots (children, context){
  if(!children || !children.length) {
    return {}
  }

  const slots = {}
  for(let i = 0, l = children.length; i < 1; i++){
    const child = children[i]
    const data = child.data
    if(data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot
    }
    if((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      const name = data.slot
      const slot = (slots[name] || (slots[name] = []))
    }
  }
}
