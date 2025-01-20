import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import { users } from "./users.js";

// Telegram Bot Token
const BOT_TOKEN = process.env.BOT_TOKEN; // Telegram Bot Token
const CHANNEL_ID = "@YourDailyStockTracker"; // Telegram Channel ID

// URLs and Paths
const SCREEN_URL = process.env.SCREEN_URL; // URL of the Screener Stock URL (should be public)
const ARCHIVE_DIR = "./archive";
const LATEST_FILE = "./latest.json";
const DIFF_FILE = "./diff.json";

// Parse HTML Table and Extract Data
function parseTable(html) {
  const regex =
    /<tr[^>]*>\s*<td[^>]*>\d+\.<\/td>\s*<td[^>]*>\s*<a[^>]*>([^<]+)<\/a>\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/g;
  const stocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    stocks.push({ name: match[1], price: parseFloat(match[2]) });
  }
  return stocks;
}

// Save JSON Data to File
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Load JSON Data from File
function loadJSON(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }
  return [];
}

async function sendTelegramMessageToAll(botToken, message, channelId) {
  const bot = new TelegramBot(botToken);

  // commented out to avoid sending messages to all users, we will use channel instead
  // for (const user of users) {
  //   const chatId = (await bot.getUpdates()).find(
  //     (u) => u.message.from.username === user.slice(1)
  //   ).message.chat.id;
  //   bot.sendMessage(chatId, message);
  // }

  // Send message to the channel
  if (channelId) {
    bot.sendMessage(channelId, message);
  }
}

// Main Function
async function main() {
  console.log("Fetching stock data...");
  const response = await fetch(SCREEN_URL);
  const html = await response.text();
  const currentData = parseTable(html);

  console.log("Loading previous data...");
  const previousData = loadJSON(LATEST_FILE);

  console.log("Calculating differences...");
  const added = currentData.filter(
    (item) => !previousData.some((p) => p.name === item.name)
  );
  const removed = previousData.filter(
    (item) => !currentData.some((c) => c.name === item.name)
  );
  const diff = { added, removed };

  // Format the full list of all stocks
  const allStocks = currentData
    .map((stock, i) => `${i + 1}. ${stock.name}`)
    .join("\n");

  if (added.length > 0 || removed.length > 0) {
    console.log("Saving differences and updating archive...");
    saveJSON(DIFF_FILE, diff);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archivePath = path.join(ARCHIVE_DIR, `diff-${timestamp}.json`);
    if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR);
    saveJSON(archivePath, diff);

    console.log("Saving latest data...");
    saveJSON(LATEST_FILE, currentData);

    console.log("Sending Telegram notification...");
    const message = `Stock Update: (powered by itsvg.in)\n\nAdded Stocks:\n${added
      .map((a) => `➕ ${a.name}`)
      .join("\n")}\n\nRemoved Stocks:\n${removed
      .map((r) => `➖ ${r.name}`)
      .join("\n")}
      \n📃 Full Stock List:\n\n${allStocks}
      `;
    await sendTelegramMessageToAll(BOT_TOKEN, message, CHANNEL_ID);
  } else {
    console.log("No changes detected. No update needed.");
  }

  console.log("All done!");
}

main().catch(console.error);
