// index.js
require('dotenv').config()

const express         = require('express')
const webPush         = require('web-push')
const bodyParser      = require('body-parser')
const path            = require('path')
const publicVapidKey  = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY
const port            = process.env.PORT || 5000
const app             = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'client')))
webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey)

app.post('/subscribe', (req, res) => {
  const subscription = req.body
  console.log(subscription)

  res.status(200).json({})
})

app.post('/push', (req, res) => {
  const subscription = req.body

  const payload = JSON.stringify({
    title:   'Push notifications with Service Workers',
    content: 'Push notifications content'
  })

  webPush.sendNotification(subscription, payload)
         .then(data => console.log(data))
         .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express running → PORT ${ port }`)
})