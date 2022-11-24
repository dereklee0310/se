const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
//   res.send('Hello :)')
    res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/form', (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + '/index.html');
  })