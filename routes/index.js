const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'))

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
