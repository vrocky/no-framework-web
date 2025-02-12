/** @jsx h */
import { h, renderToString } from "./src/h";
import { App } from "./src/App";
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

// Read the template HTML file
const template = readFileSync("./index.html", "utf-8");

// Parse HTML using jsdom
const dom = new JSDOM(template);
const document = dom.window.document;

// Find the app root div
const appRoot = document.querySelector("#app");

if (!appRoot) {
    throw new Error("❌ Error: <div id='app'></div> not found in index.html");
}

// Create an instance of App and render it
const app = new App();
const appHtml = renderToString(app.render());

// Replace content inside the #app div
appRoot.innerHTML = appHtml;

// Write the modified HTML back to `dist/index.html`
writeFileSync("./dist/index.html", dom.serialize());

console.log("✅ Static HTML successfully generated at dist/index.html");
