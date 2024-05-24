import "dotenv/config";
import chalk from "chalk";
import readline from "readline";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const envAuth = process.argv.includes("--env");

/**
 * Starts the server by logging in and checking the server status.
 * If the server is offline, it attempts to start the server.
 * @param {Page} page - The Puppeteer page object.
 * @returns {Promise<void>} - A promise that resolves once the server is started or if it is already online.
 */
export default async function startServer(page) {
  console.log(chalk.bold("[Client] Logging in..."));
  let username, password;

  if (envAuth) {
    username = process.env.ATERNOS_USERNAME;
    password = process.env.ATERNOS_PASSWORD;

    console.log(
      chalk.yellow(
        "\n[!] Using environment variables for authentication. Do not share these values."
      )
    );

    console.log(
      chalk.yellow(
        "[!] Please note that using the --env-auth flag is recommended for security reasons."
      )
    );

    if (!username || !password) {
      console.error(
        chalk.red(
          "[ERROR] Missing ATERNOS_USERNAME or ATERNOS_PASSWORD environment variables."
        )
      );
      process.exit(1);
    }
  } else {
    console.log(
      chalk.yellow(
        "\n[!] Please note that using the --env-auth flag is recommended for security reasons."
      )
    );

    username = await new Promise((resolve) => {
      rl.question(chalk.cyan("- Enter your username: "), (answer) => {
        resolve(answer);
      });
    });

    password = await new Promise((resolve) => {
      rl.question(chalk.cyan("- Enter your password: "), (answer) => {
        resolve(answer);
      });
    });
  }

  const usernameInput = await page.$(
    "body > div.go-wrapper > div > div > div.login > div.login-form > div.go-input-group.join-right > div.go-input-group-input > input"
  );
  await usernameInput.type(await username);
  const passwordInput = await page.$(
    "body > div.go-wrapper > div > div > div.login > div.login-form > div:nth-child(2) > div.go-input-group-input > input"
  );
  await passwordInput.type(await password);
  const login = await page.$(
    "body > div.go-wrapper > div > div > div.login > div.login-form > button"
  );
  await login.click();
  await page.waitForNavigation();
  await page.screenshot({ path: "screenshot/server_choose.png" });
  const serverChoose = await page.$(
    "#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers > div > div.list-action > div.servercardlist > div > div.server-body"
  );
  await page.screenshot({ path: "screenshot/server_choose2.png" });
  await serverChoose.click();
  await page.waitForSelector(
    "#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status > div > span.statuslabel-label-container > span"
  );
  const status = await page.$(
    "#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status > div > span.statuslabel-label-container > span"
  );
  console.log("[Client] Logged in successfully!");

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(msg.text());
    }
  });

  if (
    (await status.evaluate((el) =>
      el.textContent.trim().replace(/[^a-zA-Z0-9]/g, "")
    )) == "Offline"
  ) {
    console.log("[Client] Server is offline. Attempting to start server.");
    await page.evaluate(() => {
      aget("/ajax/server/start", function () {
        console.log("[Client] Server is starting..");
      });
    });
  } else {
    console.log("[Client] Server is already online.");
  }
}
