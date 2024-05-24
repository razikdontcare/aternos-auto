import edgeChromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import startServer from "./scraper.js";
import formatSeconds from "./formatTimer.js";

import chalk from "chalk";

puppeteer.use(StealthPlugin());

const LOCAL_CHROME_EXECUTABLE = "/usr/bin/google-chrome";

const options = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-gpu",
  "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
];
/**
 * This module initializes the browser and sets up a new page using Puppeteer.
 * It launches the browser, navigates to the Aternos website, and performs actions like starting the server and checking its status.
 * @module Init
 * @param {boolean} [headless=true] - Whether to run the browser in headless mode or not.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the browser instance, page instance, and timeout ID.
 */
export default async function Init(headless = true) {
  console.clear();
  console.log(chalk.bold("Aternos Uptime Bot by razikdontcare"));
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  console.log(chalk.bold("[Puppeteer] Initializing browser..."));
  const browser = await puppeteer.launch({
    executablePath,
    args: [...edgeChromium.args, ...options],
    headless: headless,
  });

  console.log(chalk.bold("[Puppeteer] Creating new page..."));
  const page = await browser.newPage();
  console.log(chalk.bold("[Puppeteer] Navigating to Aternos..."));
  await page.goto("https://aternos.org/server/");

  await page.screenshot({ path: "screenshot/login_page.png" });

  if (page.url() == "https://aternos.org/go/") {
    await startServer(page);

    async function checkServerStatus() {
      console.clear();
      console.log(chalk.bold("Aternos Uptime Bot by razikdontcare"));
      const result = await page.evaluate(() => {
        return new Promise(async (resolve) => {
          await aget("/ajax/server/get-status", (data) => {
            resolve(data.data);
          });
        });
      });

      let playerList = "";
      if (result.players > 0) {
        for (let i = 0; i < result.players; i++) {
          playerList += `  ${i + 1}. ${result.playerlist[i]}\n`;
        }
      }

      let serverStatus = `
[${chalk.bold("Server Status")}]
Server Name: ${chalk.bold(result.name)}
IP: ${chalk.cyan(result.dns.domains[0])}
Port: ${chalk.cyan(result.dns.port)}
Version: ${chalk.bold(result.version)}
Status: ${
        result.status == 0
          ? chalk.red("Offline")
          : !result.dns.port
          ? chalk.yellow("Starting")
          : chalk.green("Online")
      }
Countdown: ${chalk.bold(result.countdown ? formatSeconds(result.countdown) : 0)}
Players: ${chalk.bold(`${result.players}/${result.slots}`)}
${
  result.players > 0
    ? `${chalk.bold("Player List:")}
      ${playerList}`
    : ""
}`;

      console.log(serverStatus);
      if (result.countdown && result.countdown <= 30) {
        await page.evaluate(() => {
          aget("/ajax/server/extend-end");
          console.log("[Client] Server extended.");
        });
      }
      return setTimeout(checkServerStatus, 8000, page);
    }

    return { browser, page, timeoutId: await checkServerStatus() };
  }

  return { browser, page, timeoutId };
}
