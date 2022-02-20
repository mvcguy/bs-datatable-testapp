const exp = require('constants');
const express = require('express')
const app = express()
var path = require('path');


app.set('views', path.join(__dirname, 'app-server/views'));
app.set('view engine', 'ejs');

const port = 3000


app.use(express.static('public'))
app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap')))
app.use("/bootstrap-icons", express.static(path.join(__dirname, '/node_modules/bootstrap-icons')))

function renderWithLayout(res, view, options) {
  res.render(view, options, (err, html) => {
    // res.send(html);
    res.render('layout', {
      html: html
    })
  });
}

app.get('/', (req, res) => {
  renderWithLayout(res, 'index')
})

app.get('/index', (req, res) => {
  res.redirect('.')
})

app.get('/logistics', (req, res, next) => {
  renderWithLayout(res, 'logistics', {
    title: 'Counting to 10'
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})