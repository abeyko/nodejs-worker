const express = require('express')
const path = require("path")
const { createLogger } = require("bunyan")
const bunyanMiddleware = require("bunyan-middleware")
const bunyanDebugStream = require("bunyan-debug-stream")
const { Worker } = require('worker_threads')

const logger = createLogger({
  name: "interview",
  streams: [
    {
      level: "info",
      type: "raw",
      stream: bunyanDebugStream({
        basepath: path.resolve(__dirname, "../"),
        forceColor: true,
      }),
    },
  ],
  serializers: bunyanDebugStream.serializers,
})

const app = express()

app.use(bunyanMiddleware({ logger }))

app.get('/generate', function (req, res) {
  const worker = new Worker(__dirname + '/worker.js')
  worker.on('message', (hash) => {
    res.send(`${hash}`)
  });
  worker.on('error', (err) => {
    res.status({ status: 500 }).json({ message: err.message })
  });
  worker.on('exit', (code) => {
    if (code !== 0) {
      res.status({ status: 500 }).json({ message: code })
    }
  })
  worker.postMessage(req.query.value);
})

app.get('/health', function (req, res) {
  res.send({ status: "healthy" })
})

app.listen(3000, (err) => {
  if (err) {
    logger.error(err)
  }

  logger.info("Listening on http://localhost:3000")
})
