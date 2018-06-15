const express = require('express');
const cors = require('cors');
const router = express.Router();
const app = express();

const axios = require('axios');
const extractor = require('unfluff');

app.use(cors());

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/', async function(req, res, next) {
  try {
    const decodedUrl = decodeURI(req.query.articleUrl);
    const response = await axios.get(decodedUrl);

    const htmlData = response.data;
    const newsContent = extractor(htmlData).text;

    res.send({ content: newsContent })
  } catch(e) {
    console.log(e);
  };
});

module.exports = router;
