module.exports = throttle

function throttle(fn, opts) {
  opts = opts || {}
  var timer
  var queue = []
  const errMsg = 'Must pass options or milliseconds as second argument'
  if (!opts)
    throw new Error(errMsg)

  var msBetweenCalls

  if (typeof opts == 'string')
    msBetweenCalls = Number(opts)

  else if (typeof opts == 'number')
    msBetweenCalls = opts

  else {
    const window = opts.window || 1
    const limit = opts.limit || 1
    const exact = opts.exact || false
    msBetweenCalls = Math.ceil((window / limit) * 1000)
  }

  if (isNaN(msBetweenCalls))
    throw new Error(errMsg)

  function enqueue(args) {
    return queue.push(args)
  }

  function dequeue() {
    return queue.shift()
  }

  function kickQueue() {
    if (timer) return timer
    timer = setInterval(runQueue, msBetweenCalls)
    return timer
  }

  function runQueue() {
    const args = dequeue()

    if (queue.length == 0 || !args) {
      clearInterval(timer)
      timer = null
    }

    const result = fn.apply(null, args)
    return result
  }

  const throttled = function () {
    const args = [].slice.call(arguments)
    const position = enqueue(args)
    const timer = kickQueue()

    return {
      position: position,
      queuedAt: Date.now(),
      timeUntilCall: position * msBetweenCalls
    }
  }

  return throttled
}
