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

    //stimulate a 10% failure rate
    if (Math.random() < 0.1) {
      throw new Error("Failure");
    }
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Failure to retrieve stock data" });
  }
});

app.listen(3000, () => console.log("Server is running!"));
