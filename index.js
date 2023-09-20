const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;

app.use(cors());

async function fetchDataAndSave() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://www.oree.com.ua/");

  console.log("Парсинг Рдн");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const RdnIndexesForDay = await page.evaluate(() => {
    const elements = document.querySelectorAll("#dam_indexes .mpage-prices");
    const tradingDataArray = [];

    elements.forEach((element) => {
      const indexElement = element.querySelector(".mpage-prices-type-value");
      const persentElement = element.querySelector(".index-prices-value");

      const index = indexElement
        ? indexElement.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";
      const persent = persentElement
        ? persentElement.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";

      let item3 = {
        index: index,
        persent: persent,
      };
      tradingDataArray.push(item3);
    });

    return tradingDataArray;
  });

  console.log("Парсинг Рдн Okey");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Парсинг Рдн За месяц");

  await page.evaluate(() => {
    const element = document.querySelector(
      '#results_site_block .radio-group input[type="radio"][value="month"]'
    );
    if (element) {
      element.style.visibility = "visible";
      element.style.display = "block";
    }
  });

  const buttonElement2 = await page.$(
    '#results_site_block .radio-group input[type="radio"][value="month"]'
  );

  if (buttonElement2) {
    await buttonElement2.click();
    console.log("buttonElement2 click");
  } else {
    console.error('Кнопка с классом "n-2" не найдена.');
    await browser.close();
    return;
  }

  console.log("Парсинг Рдн За Обьект загружен");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Парсинг Рдн За Приступаю");

  const RdnIndexesForMonth = await page.evaluate(() => {
    const elements = document.querySelectorAll("#dam_indexes .mpage-prices");
    const tradingDataArray = [];

    elements.forEach((element) => {
      const indexElement = element.querySelector(".mpage-prices-type-value");
      const persentElement = element.querySelector(".index-prices-value");

      const index = indexElement
        ? indexElement.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";
      const persent = persentElement
        ? persentElement.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";

      let item3 = {
        index: index,
        persent: persent,
      };
      tradingDataArray.push(item3);
    });

    return tradingDataArray;
  });

  console.log(2);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(2);

  const IndexColGroup = await page.evaluate(() => {
    const elements = document.querySelectorAll("#main_indexes .index-block");
    const IndexColGroupArray = [];

    elements.forEach((element) => {
      const indexCountry = element.querySelector(".index-country-name");
      const indexElement = element.querySelector(".index-prices-value");
      const persentElement = element.querySelector(
        ".index-prices-compare-block span"
      );

      const county = indexCountry
        ? indexCountry.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";
      const index = indexElement
        ? indexElement.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";
      const persent = persentElement
        ? persentElement.textContent
            .replace(/\s+/g, " ")
            .replace(/\n/g, ",")
            .trim()
        : "none";

      let item4 = {
        county: county,
        index: index,
        persent: persent,
      };
      IndexColGroupArray.push(item4);
    });

    return IndexColGroupArray;
  });

  console.log(3);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(3);

  const IndexesForDay = await page.evaluate(() => {
    const elements = document.querySelectorAll("#main_price_indexes .col");
    const dataArray = [];

    elements.forEach((element) => {
      const index = element
        .querySelector(".index-prices-value")
        .textContent.replace(/\s+/g, " ")
        .replace(/\n/g, ",")
        .trim();
      const persent = element
        .querySelector(".index-prices-compare-block")
        .textContent.replace(/\s+/g, " ")
        .replace(/\n/g, ",")
        .trim();

      let item = {
        index: index,
        persent: persent,
      };
      dataArray.push(item);
    });

    return dataArray;
  });

  await page.evaluate(() => {
    const element = document.querySelector(
      '.prices_indexes_picker input[type="radio"][value="month"]'
    );
    if (element) {
      element.style.visibility = "visible";
      element.style.display = "block";
    }
  });

  const buttonElement = await page.$(
    '.prices_indexes_picker input[type="radio"][value="month"]'
  );

  if (buttonElement) {
    await buttonElement.click();
  } else {
    console.error('Кнопка с классом "n-2" не найдена.');
    await browser.close();
    return;
  }

  console.log(4);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(4);

  const IndexesForMonth = await page.evaluate(() => {
    const elements = document.querySelectorAll("#main_price_indexes .col");
    const dataArray = [];

    elements.forEach((element) => {
      const index = element
        .querySelector(".index-prices-value")
        .textContent.replace(/\s+/g, " ")
        .replace(/\n/g, ",")
        .trim();
      const persent = element
        .querySelector(".index-prices-compare-block span")
        .textContent.replace(/\s+/g, " ")
        .replace(/\n/g, ",")
        .trim();

      let item2 = {
        index: index,
        persent: persent,
      };
      dataArray.push(item2);
    });

    return dataArray;
  });

  await browser.close();

  const result = {
    RdnIndexesForDay,
    RdnIndexesForMonth,
    IndexesForDay,
    IndexesForMonth,
    IndexColGroup,
  };

  const jsonData = JSON.stringify(result, null, 2);
  fs.writeFileSync("parsedData.json", jsonData);
  console.log("ok");
}

fetchDataAndSave();

setInterval(fetchDataAndSave, 1200000);

app.get("/get-data", (req, res) => {
  const jsonPath = path.join(__dirname, "parsedData.json");

  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Произошла ошибка при чтении JSON файла.");
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`start ${port}`);
});
