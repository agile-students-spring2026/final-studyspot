#!/usr/bin/env node

import server from './app.js'

// PORT can be overridden via .env (e.g. PORT=5001 if macOS AirPlay holds 5000)
const port = process.env.PORT || 5050

// call a function to start listening to the port
const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})

// a function to stop listening to the port
const close = () => {
  listener.close()
}

// export the close function
export { close }