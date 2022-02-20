const exp = require('constants');
const express = require('express')
const app = express()
var path = require('path');


app.set('views', path.join(__dirname, 'app-server/views'));
app.set('view engine', 'ejs');

const port = 3000


//
// static files middleware
//
app.use(express.static('public'))
app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap')))
app.use("/bootstrap-icons", express.static(path.join(__dirname, '/node_modules/bootstrap-icons')))

function renderWithLayout(res, view, options) {
  console.log(options);
  res.render(view, options, (err, html) => {
    // res.send(html);
    res.render('layout', {
      html: html
    })
  });
}

//
// views
//
app.get('/', (req, res) => {
  renderWithLayout(res, 'index')
})

app.get('/index', (req, res) => {
  res.redirect('.')
})

app.get('/logistics', (req, res, next) => {
  renderWithLayout(res, 'logistics', getBookingLines(1))
})

//
// Web API for the test app
//


const bookingLines = [];
const bookingLinesMetaData = (page) => {
  return {
    pageIndex: page,
    pageSize: 10,
    totalRecords: bookingLines.length
  };
};

function loadBookingLines() {
  if (bookingLines.length > 0) return;

  for (let index = 1; index < 20; index++) {
    var bookingLine = {
      "lineNbr": index,
      "desc": 'Car part-' + index,
      "qty": 5 + index,
      "cost": 120 + index,
      "extCost": (5 + index) * (120 + index)
    };
    bookingLines.push(bookingLine);
  }
}

function getBookingLines(page = 1) {

  loadBookingLines();
  data = bookingLines;
  mdata = bookingLinesMetaData(1);

  var start = page <= 1 ? 0 : (page - 1) * mdata.pageSize;
  var end = start + mdata.pageSize;
  var maxIndex = data.length - 1;
  if (start > maxIndex || end > maxIndex) return { items: [], metaData: undefined };

  var pageData = [];
  for (let index = start; index < end; index++) {
    const element = data[index];
    pageData.push(element);
  }
  var result = {
    items: pageData,
    metaData: mdata
  };

  return result;
}

app.get('/api/bookinglines', (req, res, next) => {
  loadBookingLines();

  var pageNumber = 1;
  var page = req.query.page;
  if (page) {
    try {
      pageNumber = parseInt(page);
      if (pageNumber <= 0)
        pageNumber = 1;
    } catch { }
  }

  var result = getBookingLines(pageNumber);
  res.send(result);
})

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
