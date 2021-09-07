export function test(msg){
  if(process.env.NODE_ENV !== 'production'){
    console.log(msg)
  }
}



