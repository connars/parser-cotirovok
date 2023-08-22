const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000; 


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.oree.com.ua/');

  await page.waitForSelector('.index-price-wrap');

  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll('.index-price-wrap');
    const dataArray = [];

    elements.forEach(element => {
      const extractedData = element.textContent.replace(/\s+/g, ' ').replace(/\n/g, ',').trim();
      dataArray.push(extractedData);
    });

    return dataArray;
  });

  await browser.close();

  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('parsedData.json', jsonData);

  console.log('ok');
})();

app.get('/get-data', (req, res) => {
  const jsonPath = path.join(__dirname, 'parsedData.json');

  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Произошла ошибка при чтении JSON файла.');
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`start ${port}`);
});