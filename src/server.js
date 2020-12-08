const express = require("express")
const bcrypt = require("bcrypt")
const path = require("path")
const { createLogger } = require("bunyan")
const bunyanMiddleware = require("bunyan-middleware")
const bunyanDebugStream = require("bunyan-debug-stream")

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

app.get("/generate", (req, res) => {
  const hash = bcrypt.hashSync(req.query.value, 16)
  res.send({ hash })
})

app.get("/health", (req, res) => {
  res.send({ status: "healthy" })
})

app.listen(3000, (err) => {
  if (err) {
    logger.error(err)
  }

  logger.info("Listening on http://localhost:3000")
})
