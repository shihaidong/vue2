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
    
  }
}
