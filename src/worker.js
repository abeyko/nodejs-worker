const bcrypt = require("bcrypt")
const { parentPort } = require('worker_threads')

function getHash(queryValue) {
  let hash = bcrypt.hashSync(queryValue, 16)
  return hash
}

parentPort.on('message', (queryValue) => {
  const hash = getHash(queryValue)
  parentPort.postMessage(hash)
})