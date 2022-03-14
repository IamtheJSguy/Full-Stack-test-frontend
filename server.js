const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
let app = express()
let history = require('connect-history-api-fallback')
app.use(history())
app.use(serveStatic(path.join(__dirname, 'dist')))
const port = process.env.PORT || 80
app.listen(port, () => {
  console.log(`app is running on ${port}`)
})
