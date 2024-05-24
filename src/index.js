import Init from "./lib/browser.js";

let b, t;

(async () => {
  const { browser, timeoutId } = await Init();
  b = browser;
  t = timeoutId;
})();

process.on("SIGINT", async () => {
  console.log("Ctrl + C detected, closing browser...");
  clearTimeout(t);
  try {
    await b.close();
  } catch (err) {
    console.error("Error closing browser:", err);
  } finally {
    console.clear();
    console.log("Thank you for using Aternos Uptime Bot by razikdontcare!");
    process.exit(0);
  }
});
