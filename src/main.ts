import kaplay from 'kaplay'

kaplay({
  background: [0, 0, 0, 0],
})

const { start } = await import('./scenes')

start()

// press F1
// debug.inspect = true
