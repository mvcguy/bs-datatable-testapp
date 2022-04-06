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
  // console.log(options);
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

app.get('/api/bookinglines', (req, res, next) => {
  var result = getBookingLines(getPageFromQuery(req));
  res.send(result);
})

app.get('/api/stockitems', (req, res, next) => {
  var page = getPageFromQuery(req);
  var result = getInventoryItems(page);
  res.send(result);
});

//
// service private methods
//


const bookingLines = [];
const inventoryItems = [];

const bookingLinesMetaData = (page) => {
  return {
    pageIndex: page,
    pageSize: 10,
    totalRecords: bookingLines.length
  };
};

const inventoryMetaData = (page) => {
  return {
    pageIndex: page,
    pageSize: 10,
    totalRecords: inventoryItems.length
  };
}

function loadInventoryItems() {

  if (inventoryItems.length > 0) return;

  for (let i = 0; i < 20; i++) {
    var inventoryItem = {
      "id": 'CS-' + i,
      "name": 'NAME-' + i,
    };

    inventoryItems.push(inventoryItem);
  }
}

function loadBookingLines() {
  if (bookingLines.length > 0) return;

  for (let index = 1; index < 20; index++) {
    var bookingLine = {
      "lineNbr": index,
      "inventoryId": inventoryItems[parseInt(Math.random() * 100 / 10)].id,
      "desc": 'Car part-' + index,
      "qty": 5 + index,
      "cost": 120 + index,
      "extCost": (5 + index) * (120 + index)
    };
    bookingLines.push(bookingLine);
  }
}

/**
 * @param {number} pageNumber
 * @param {any[]} data 
 * @param {{pageIndex: number;
      pageSize: number;
      totalRecords: number}} mdata
 * @returns {{items:any[]; metaData: any}}
 */
function getPage(pageNumber, data, mdata) {

  var start = pageNumber === 1 ? 0 : (pageNumber - 1) * mdata.pageSize;
  var end = start + mdata.pageSize;
  var maxIndex = data.length - 1;

  if (end > maxIndex)
    end = data.length;

  console.log('start: ', start, 'end', end);

  if (start > maxIndex) return { items: [], metaData: undefined };

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

function getInventoryItems(page = 1) {
  if (page < 1) return { items: [], metaData: undefined };
  return getPage(page, inventoryItems, inventoryMetaData(1));
}

function getBookingLines(page = 1) {
  if (page < 1) return { items: [], metaData: undefined };
  return getPage(page, bookingLines, bookingLinesMetaData(1));
}

function getPageFromQuery(req) {
  var pageNumber = 0;
  var page = req.query.page;
  if (page) {
    try {
      pageNumber = parseInt(page);
    } catch { }
  }

  return pageNumber;
}

if (!module.parent) {

  //
  // init global data
  //

  loadInventoryItems();
  loadBookingLines();

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
