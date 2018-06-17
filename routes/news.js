const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const router = express.Router();
const app = express();

const _ = require('lodash');
const axios = require('axios');
const extractor = require('unfluff');
const crypto = require('crypto');

const snapshotDir = 'images';
const staticSnapshotDir = `public/${snapshotDir}`

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
  const extractedData = extractor(htmlData);
  const text = extractedData.text;
  const lines = text.split('\n');

  console.log(text);

  lines = _.uniq(lines);
  text = lines.join('\n');

  return text;
}

const generateFilenameFromUrl = (url) => {
  return crypto.createHash('md5').update(url).digest("hex");
}

router.get('/content', cors(corsOptions), async function(req, res, next) {
  try {
    const decodedUrl = decodeURI(req.query.articleUrl);
    const newsContent = await extractText('https://www.quora.com/What-are-the-best-things-to-order-at-The-Cheesecake-Factory');
    res.send({ content: newsContent });
  } catch(e) {
    console.log(e);
  };
});

router.get('/screenshot', cors(corsOptions), async function(req, res, next) {
  try {
    const decodedUrl = decodeURI(req.query.articleUrl);
    const screenshotFilename = generateFilenameFromUrl(decodedUrl);

    await generateSnapshot(decodedUrl, `${process.cwd()}/${staticSnapshotDir}/${screenshotFilename}.png`);

    res.send({ snapshotPath: `http://localhost:3001/${snapshotDir}/${screenshotFilename}.png` });
  } catch(e) {
    console.log(e);
  };
});

module.exports = router;
