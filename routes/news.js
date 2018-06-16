const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const router = express.Router();
const app = express();

const _ = require('lodash');
const axios = require('axios');
const extractor = require('unfluff');

const snapshotDir = 'public/images';
const snapshotPath = `/${snapshotDir}/snapshot.png`;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const generateSnapshot = async(url, snapshotPath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: snapshotPath, fullPage: true });
  await browser.close();
}

const extractText = async (url) => {
  const response = await axios.get(url);
  const htmlData = response.data;

  let text = extractor(htmlData).text;
  let lines = text.split('\n');
  lines = _.uniq(lines);
  text = lines.join('\n');

  return text;
}

router.get('/content', cors(corsOptions), async function(req, res, next) {
  try {
    const decodedUrl = decodeURI(req.query.articleUrl);
    const newsContent = extractText(decodedUrl);
    res.send({ content: newsContent });
  } catch(e) {
    console.log(e);
  };
});

router.get('/screenshot', cors(corsOptions), async function(req, res, next) {
  try {
    const decodedUrl = decodeURI(req.query.articleUrl);
    await generateSnapshot(decodedUrl, `${process.cwd()}/${snapshotPath}`);
    res.send({ snapshotPath: `http://localhost:3001/images/snapshot.png` });
  } catch(e) {
    console.log(e);
  };
});

module.exports = router;
