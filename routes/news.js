const express = require('express');
const router = express.Router();

const axios = require('axios');
const extractor = require('unfluff');

/* GET users listing. */
router.get('/', function(req, res, next) {
  axios.get('https://www.reuters.com/article/us-usa-salmonella-kellogg/kellogg-issues-massive-honey-smacks-cereal-recall-over-salmonella-risk-idUSKBN1JA32M')
  .then(function (response) {
    console.log(response.status)
    const htmlData = response.data;
    console.log(extractor(htmlData).text);
  })
  .catch(function (error) {
    console.log(error);
  });
});

module.exports = router;
