import kaplay from 'kaplay'

kaplay({
  background: [0, 0, 0, 0],
  font: 'nunito',
})

const { start } = await import('./scenes')

start()

// press F1
// debug.inspect = true
