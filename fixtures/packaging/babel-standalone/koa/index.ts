// import compose from 'koa-compose'

const  A = async (context: any, next: any) => {
  console.log('before A')

  await next()

  console.log('after A')
}

const B = async (context: any, next: any) => {
  console.log('before B')

  await next()

  console.log('after B')
}

const C = async (context: any, next: any) => {
  console.log('before C', context)

  await next()

}


function compose(middlewares) {
  debugger
  return function (context, next) {
    let index = -1
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      const fn = middlewares[i] || next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)))
      } catch (err) {
          console.log('err', err)
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}


export const koaFn = compose([A, B, C])
console.log('koaFn', koaFn)

 koaFn(
   {
     name: 'svip-button',
   },
   () => {
     console.log('执行业务流程')
   },
 )