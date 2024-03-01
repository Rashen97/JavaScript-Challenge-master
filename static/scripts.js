const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function drawLine(start, end, style) {
  ctx.beginPath();
  ctx.strokeStyle = style || "black";
  ctx.moveTo(...start);
  ctx.lineTo(...end);
  ctx.stroke();
}

function drawTriangle(apex1, apex2, apex3) {
  ctx.beginPath();
  ctx.moveTo(...apex1);
  ctx.lineTo(...apex2);
  ctx.lineTo(...apex3);
  ctx.fill();
}

document.addEventListener("DOMContentLoaded", async () => {
  const spinner = document.querySelector(".spinner");
  try {
    const stockSymbols = await fetchStocks();
    const promises = stockSymbols.map((Symbol) => fetchStockData(Symbol));

    Promise.all(promises).then(() => {
      spinner.style.display = "none";
    });
  } catch (error) {
    console.error("failed to initialize:", error);
    spinner.style.display = "none";
  }
});

async function fetchStocks() {
  const response = await fetch("/stocks");
  if (!response.ok) throw new Error("Failed to fetch stock symbols");
  const { stockSymbols } = await response.json();
  return stockSymbols;
}

async function fetchStockData(symbol) {
  try {
    const response = await fetch("/stocks/${symbol}");
    if (!response.ok) throw new Error("Failed to fetch data for ${symbol}");
    const data = await response.json();
    console.log("Data for ${symbol}:", data);
    //process and display this data as needed
  } catch (error) {
    console.error("Error fetching data for ${symbol}:", error);
  }
}

drawLine([50, 50], [50, 550]);
drawTriangle([35, 50], [65, 50], [50, 35]);

drawLine([50, 550], [950, 550]);
drawTriangle([950, 535], [950, 565], [965, 550]);
