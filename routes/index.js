const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
