#!/usr/bin/env node

import mongoose from 'mongoose';
import server from './app.js'

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));

// PORT can be overridden via .env (e.g. PORT=5001 if macOS AirPlay holds 5000)
const port = process.env.PORT || 5000

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