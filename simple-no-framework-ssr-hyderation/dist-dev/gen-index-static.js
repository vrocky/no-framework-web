// src/h.ts
function h(type, props, ...children) {
  return {
    type,
    props: {
      ...props || {},
      children: children.flat().filter((child) => child != null)
    }
  };
}
function renderToString(element) {
  if (typeof element === "string" || typeof element === "number") {
    return element.toString();
  }
  if (typeof element.type === "function") {
    let result;
    if (/^\s*class\s+/.test(element.type.toString())) {
      const instance = new element.type(element.props);
      result = instance.render();
    } else {
      result = element.type(element.props);
    }
    return renderToString(result);
  }
  const tag = element.type;
  const props = element.props || {};
  let propsString = "";
  Object.entries(props).forEach(([name, value]) => {
    if (name === "children")
      return;
    if (name === "className") {
      propsString += ` class="${value}"`;
    } else if (name === "style" && typeof value === "object") {
      const styleString = Object.entries(value).map(([key, val]) => `${key}:${val}`).join(";");
      propsString += ` style="${styleString}"`;
    } else if (!name.startsWith("on")) {
      propsString += ` ${name}="${value}"`;
    }
  });
  const selfClosingTags = ["img", "input", "br", "hr", "meta", "link"];
  if (selfClosingTags.includes(tag)) {
    return `<${tag}${propsString} />`;
  }
  let childrenString = "";
  if (props.children) {
    childrenString = props.children.filter((child) => child != null).map((child) => renderToString(child)).join("");
  }
  return `<${tag}${propsString}>${childrenString}</${tag}>`;
}

// src/components/TextBox.tsx
var TextBox = class {
  constructor() {
    this.inputRef = null;
  }
  getText() {
    return this.inputRef ? this.inputRef.value.trim() : "";
  }
  clear() {
    if (this.inputRef) {
      this.inputRef.value = "";
    }
  }
  append(text) {
    if (this.inputRef) {
      this.inputRef.value += text;
    }
  }
  render() {
    return /* @__PURE__ */ h(
      "input",
      {
        type: "text",
        ref: (el) => this.inputRef = el,
        placeholder: "Type text here...",
        style: "padding: 8px; flex: 1; border: 1px solid #ddd;"
      }
    );
  }
};

// src/components/TextArea.tsx
var TextArea = class {
  constructor() {
    this.textAreaRef = null;
  }
  getText() {
    return this.textAreaRef ? this.textAreaRef.value : "";
  }
  clear() {
    if (this.textAreaRef) {
      this.textAreaRef.value = "";
    }
  }
  append(text) {
    if (this.textAreaRef) {
      const currentPos = this.textAreaRef.selectionStart;
      const currentValue = this.textAreaRef.value;
      this.textAreaRef.value = currentValue.substring(0, currentPos) + text + currentValue.substring(currentPos);
      this.textAreaRef.selectionStart = this.textAreaRef.selectionEnd = currentPos + text.length;
      this.textAreaRef.focus();
    }
  }
  render() {
    return /* @__PURE__ */ h(
      "textarea",
      {
        ref: (el) => this.textAreaRef = el,
        placeholder: "Your text will appear here...",
        style: "padding: 8px; width: 100%; height: 150px; border: 1px solid #ddd; margin-top: 10px; resize: vertical;"
      }
    );
  }
};

// src/utils/events.ts
var EventEmitter = class {
  constructor() {
    this.handlers = [];
  }
  fire(event) {
    this.handlers.forEach((handler) => handler(event));
  }
  on(handler) {
    this.handlers.push(handler);
    return {
      dispose: () => {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
          this.handlers.splice(index, 1);
        }
      }
    };
  }
  dispose() {
    this.handlers = [];
  }
};

// src/components/Toolbar.tsx
var Toolbar = class {
  constructor() {
    this._onClick = new EventEmitter();
  }
  onDidClick(callback) {
    return this._onClick.on(callback);
  }
  render() {
    return /* @__PURE__ */ h(
      "button",
      {
        onClick: () => this._onClick.fire(),
        style: "\r\n                    padding: 8px 16px;\r\n                    background: #0078d4;\r\n                    color: white;\r\n                    border: none;\r\n                    border-radius: 4px;\r\n                    cursor: pointer;\r\n                    font-size: 14px;\r\n                    transition: background 0.2s;\r\n                "
      },
      "Add"
    );
  }
  dispose() {
    this._onClick.dispose();
  }
};

// src/components/Panel.tsx
var Panel = class {
  constructor() {
    this.disposables = [];
    this.textBox = new TextBox();
    this.textArea = new TextArea();
    this.toolbar = new Toolbar();
    this.disposables.push(
      this.toolbar.onDidClick(() => {
        const text = this.textBox.getText();
        if (text) {
          this.textArea.append(text + "\n");
          this.textBox.clear();
        }
      })
    );
  }
  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.toolbar.dispose();
  }
  render() {
    return /* @__PURE__ */ h("div", { style: "padding: 20px; max-width: 600px; margin: auto;" }, /* @__PURE__ */ h("div", { style: "display: flex; gap: 10px; align-items: start;" }, this.textBox.render(), this.toolbar.render()), this.textArea.render());
  }
};

// src/App.tsx
var App = class {
  constructor() {
    this.rootElement = null;
  }
  setRoot(element) {
    this.rootElement = element;
  }
  render() {
    return /* @__PURE__ */ h(Panel, null);
  }
};

// gen-index-static.tsx
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
var template = readFileSync("./index.html", "utf-8");
var dom = new JSDOM(template);
var document2 = dom.window.document;
var appRoot = document2.querySelector("#app");
if (!appRoot) {
  throw new Error("\u274C Error: <div id='app'></div> not found in index.html");
}
var app = new App();
var appHtml = renderToString(app.render());
appRoot.innerHTML = appHtml;
writeFileSync("./dist/index.html", dom.serialize());
console.log("\u2705 Static HTML successfully generated at dist/index.html");
//# sourceMappingURL=gen-index-static.js.map
