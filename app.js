const express = require("express");
const path = require("path");
const stocks = require("./stocks");

const app = express();
app.use(express.static(path.join(__dirname, "static")));

app.get("/stocks", async (req, res) => {
  const stockSymbols = await stocks.getStocks();
  res.send({ stockSymbols });
});

app.get("/stocks/:symbol", async (req, res) => {
  const {
    params: { symbol },
  } = req;
  const data = await stocks.getStockPoints(symbol, new Date());
  res.send(data);
});

app.get("/stocks/:symbol", async (req, res) => {
  const {
    params: { symbol },
  } = req;
  try {
    const data = await stocks.getStockPoints(symbol, new Date());
    //10% failure
    if (Math.random() < 0.1) {
      throw new Error("failure");
    }
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve stock data" });
  }
});

async function fetchStocks() {
  try {
    const response = await fetch("/stocks");
    const { stockSymbols } = await response.json();
    return stockSymbols;
  } catch (error) {
    console.error("Failed to fetch stocks", error);
  }
}

async function fetchStockData(symbol) {
  try {
    const response = await fetch("/stocks/${symbol}");
    const data = await response.json();
    console.log("Data for ${symbol}:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch data for ${symbol} ", error);
  }
}

async function loadData() {
  const spinner = document.querySelector(".spinner");
  const symbol = await fetchStocks();

  const dataPromises = symbols.map((symbol) => fetchStockData(symbol));

  Promise.all(dataPromises).then(() => {
    spinner.style.display = "none";
  });
}

app.listen(3000, () => console.log("Server is running!"));
