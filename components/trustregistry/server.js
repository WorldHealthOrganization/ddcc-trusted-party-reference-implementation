const express = require('express')
const trusthandler = require('./modules/TrustHandler')
const app = express()
const port = 8080

app.get('/dcc', (req, res) => {
  return res.send(trusthandler.TRUST_REGISTRY["EUDCC"]);
})

app.get('/shc', (req, res) => {
  return res.send(trusthandler.TRUST_REGISTRY["SHC"]);
})

app.get('/icao', (req, res) => {
  return res.send(trusthandler.TRUST_REGISTRY["ICAO"]);
})

app.get('/cred', (req, res) => {
  return res.send(trusthandler.TRUST_REGISTRY["CRED"]);
})

app.listen(port, () => {
  trusthandler.initialize();
  console.log(`Listening on port ${port}`)
})
