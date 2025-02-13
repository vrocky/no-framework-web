# A Hybrid, Event-Driven UI Framework with a Decoupled Renderer for SSR 
In modern UI development, flexibility and performance are paramount. Traditional UI systems like WPF or Android typically rely on a code-behind approach where UI behavior is tightly coupled with the controls themselves. In contrast, our framework introduces a **decoupled renderer**  that sits apart from the application logic. This separation not only enables explicit, event-driven updates but also makes server-side rendering (SSR) and incremental updates more attainable.

---


## Overview of the Approach 

Our framework combines the clarity of JSX-based, declarative UI definitions with an imperative, event-driven update mechanism. Instead of embedding rendering logic within each component—as is common in classic code-behind systems—the renderer is implemented as a separate module. This design choice is instrumental in supporting SSR, where pre-rendered HTML needs to be efficiently “hydrated” with interactive behavior on the client side.
**Key Features:**  
- **Declarative UI Composition:** 
Use JSX to build a virtual representation of your UI, making layouts clear and maintainable.
 
- **Decoupled Renderer:** 
A dedicated rendering engine handles DOM creation, updates, and hydration independently of component logic, facilitating SSR and incremental updates.
 
- **Event-Driven Updates:** 
Components notify the renderer via explicit methods (such as `notify` or `refresh`) when updates are needed, similar to traditional event-driven systems but with a modern twist.
 
- **Flexible Callbacks:** 
Just as in WPF, Android, or WinForms, developers can wire up any event listeners or callbacks they prefer, giving them complete control over when and how the UI updates.


---
## Class Digram Glimpse for Quick Overview 
```
┌───────────────────────────────┐
│           App                  │
│--------------------------------│
│ - textBox: TextBox             │
│ - listView: ListView           │
│ - renderer?: Renderer          │
│--------------------------------│
│ + onAttach(renderer)           │
│ + handleAddClick()             │
│ + render(): VirtualNode         │
└───────────────────────────────┘
              │
              ▼
┌────────────────────────────────┐
│           Renderer               │
│----------------------------------│
│ - componentMap: Map<Component>    │
│ - eventMap: WeakMap<Element>      │
│----------------------------------│
│ + render(element, container)     │
│ + hydrate(element, container)    │
│ + refresh(component)             │
│ + removeComponent(component)     │
└────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────┐
│            Component               │
│------------------------------------│
│ + render(): VirtualNode             │
│ + onAttach?(renderer: Renderer)     │
└────────────────────────────────────┘
          ▲        ▲        ▲
          │        │        │
┌──────────────┐ ┌───────────────┐ ┌───────────────┐
│   TextBox    │ │   ListView    │ │    Button     │
└──────────────┘ └───────────────┘ └───────────────┘


```


## Core Components and Their Roles 

### 1. App Component 
 
- **Role:** 
Serves as the primary composition unit that brings together various UI elements like text inputs, lists, and buttons.
 
- **Responsibilities:**  
  - **Event Coordination:**  Implements event handlers (e.g., for button clicks) that trigger explicit UI updates.
 
  - **Composition:**  Uses JSX to define the overall layout, integrating sub-components seamlessly.
 
  - **Lifecycle Integration:**  Connects with the renderer through an `onAttach(renderer)` method, ensuring that updates are managed externally.

### 2. Decoupled Renderer 
 
- **Role:** 
Acts as an independent engine that converts virtual DOM representations into real DOM nodes.
 
- **Responsibilities:**  
  - **DOM Creation & Hydration:**  Builds the UI from scratch or “hydrates” an existing, server-rendered DOM by attaching event listeners and updating properties.
 
  - **Incremental Updates:**  Utilizes diffing techniques to update only the parts of the UI that have changed.
 
  - **Event Management:**  Maintains mappings between component instances and their DOM elements, ensuring that events are properly routed.
 
- **Key Differentiator:** 
By isolating the renderer from the application logic, our framework supports SSR seamlessly. The renderer’s separation means that the same rendering logic can be executed both on the server (to produce static HTML) and on the client (to enable interactivity).

### 3. UI Components (TextBox, ListView, Button) 
 
- **Role:** 
Modular, reusable widgets that encapsulate specific UI functions.
 
- **Responsibilities:**  
  - **Self-Contained Rendering:**  Each component defines a `render()` method that outputs a JSX-like structure.
 
  - **Direct Interaction:**  Provide methods (e.g., `getText()`, `addItem()`) to manipulate internal state imperatively.
 
  - **Event Wiring:**  Rely on external notifications (via the renderer) to update their visual state when necessary.

### 4. Helper Utilities 
 
- **The `h` Function:** 
Transforms JSX syntax into a virtual element tree, similar to React’s `createElement`.
 
- **EventEmitter and Others:** 
Facilitate decoupled communication between components, offering a simple pub–sub mechanism to handle events.


---


## Conceptual Flow 
 
1. **Initialization:**  
  - **Component Instantiation:** 
The App and its child components are instantiated.
 
  - **Renderer Attachment:** 
The App calls `onAttach(renderer)`, linking the application to the external rendering engine.
 
2. **Rendering:**  
  - **Declarative Composition:** 
The App’s `render()` method returns a JSX tree, which the `h` function converts into a virtual DOM.
 
  - **DOM Creation:** 
The Renderer processes the virtual DOM and builds the actual DOM, while keeping track of component associations.
 
3. **Event Handling & Explicit Updates:**  
  - **User Interaction:** 
When an event occurs (e.g., a button click), the corresponding event handler executes.
 
  - **Imperative Update:** 
The event handler calls methods (such as `addItem()` or `clear()`) on components, and then explicitly signals the Renderer (via `refresh` or `notify`) to update the UI.
 
  - **Incremental Rendering:** 
The Renderer diff-checks the updated virtual DOM against the existing DOM, refreshing only the modified parts.
 
4. **Hydration:**  
  - **SSR Support:** 
If static HTML is already present (from server-side rendering), the Renderer’s `hydrate` method attaches the necessary event listeners and updates the UI without re-creating it.
 
  - **Error Handling:** 
Discrepancies between the pre-rendered and expected DOM are reconciled, ensuring consistency.


---


## Design Patterns and Key Vocabulary 
**Decoupled Renderer and Retained-Mode UI System**  
- **Definition:** 
A retained-mode system maintains an in-memory tree of UI components, while a decoupled renderer independently converts this tree into a real DOM.
 
- **Usage:** 
Unlike WPF or Android’s code-behind approach, the Renderer in our framework is separate, allowing for server-side rendering and explicit update control.
**Declarative Composition with Imperative Update Control**  
- **Definition:** 
The UI layout is defined declaratively using JSX, but updates occur via explicit, imperative calls.
 
- **Usage:** 
This is analogous to the code-behind model in classic frameworks, where event handlers directly manipulate UI controls.
**Event-Driven Notification Mechanism**  
- **Definition:** 
Components trigger UI updates by calling specific methods (e.g., `notify`, `refresh`), rather than relying on automatic data-binding.
 
- **Usage:** 
This provides the flexibility to integrate various callbacks or listeners, similar to how events are handled in WPF, Android, or WinForms.
**Incremental Rendering and Hydration**  
- **Definition:** 
The Renderer updates only the portions of the DOM that have changed and can “hydrate” a pre-existing DOM, attaching interactivity without a full re-render.
 
- **Usage:** 
This design is key for supporting SSR and optimizing performance on the client side.


---


## Final Thoughts 

This hybrid, event-driven UI framework offers the best of both traditional and modern worlds:
 
- **Decoupled Rendering Engine:** 
By isolating the Renderer from component logic, the framework supports SSR and provides a clean separation between view definition and view updates.
 
- **Imperative Event-Driven Updates:** 
Developers have explicit control over UI updates, mirroring the familiar patterns found in systems like WPF, Android, and WinForms—without being locked into a reactive paradigm.
 
- **Flexible, Declarative UI with Clear Control:** 
The use of JSX allows for clean, declarative UI definitions, while the explicit notification system provides the flexibility to manage updates exactly as needed.

This design empowers developers to build scalable user interfaces that can function efficiently in both simple and complex scenarios, supporting traditional event-driven patterns while leveraging modern web technologies for performance and flexibility.


---


By adopting this approach, you create a UI framework that not only supports the convenience of SSR but also provides robust, explicit control over UI updates—a unique blend that stands apart from conventional code-behind systems.




---


## High-Level Implementation Overview 

### 1. Core Modules and Their Responsibilities 
 
- **JSX Parser / h Function:**  
  - **Role:**  Transforms JSX syntax into lightweight virtual DOM elements.
 
  - **Output:**  Virtual DOM nodes (objects) with properties like `type`, `props`, and `children`.
 
- **Component Base:**  
  - **Role:**  Define an interface (or abstract class) that requires a `render()` method.
 
  - **Responsibility:**  Each UI component (e.g., `TextBox`, `ListView`, `Button`, `App`) implements `render()` to return its virtual DOM representation.
 
- **Decoupled Renderer:**  
  - **Role:**  An independent module that converts the virtual DOM into actual DOM nodes.
 
  - **Key Methods:**  
    - `render(virtualElement, container)` – Recursively creates DOM nodes from the virtual tree.
 
    - `hydrate(virtualElement, container)` – Binds behavior (event listeners, attributes) to pre-rendered DOM (supporting SSR).
 
    - `refresh(component)` / `notify(component)` – Updates only the changed parts of the UI by diffing the new virtual tree with the current DOM.
 
  - **Extra:**  Maintains maps (e.g., component-to-DOM) for efficient updates.
 
- **Event System / Callbacks:**  
  - **Role:**  Allow components to register callbacks and event listeners (using a simple EventEmitter or standard callback registration).
 
  - **Usage:**  Instead of automatic reactive binding, updates are triggered by explicit calls (e.g., in a button click handler).


---


## Implementation Strategies 

### A. Building the Virtual DOM 
 
1. **Define Virtual Node Structure:**  
  - Create an interface for virtual nodes (e.g., `type`, `props`, `children`).
 
  - Example:

```typescript
interface VirtualNode {
  type: string | Function | Component;
  props: { [key: string]: any; children?: VirtualNode[] };
}
```
 
2. **Implement the h Function:** 
  - Convert JSX expressions into virtual nodes.

  - Ensure that children are flattened and null/undefined values are filtered out.

### B. Designing Components 
 
1. **Component Interface / Base Class:**  
  - All UI components must implement a `render()` method that returns a VirtualNode.
 
  - Optionally include lifecycle methods such as `onAttach(renderer)`.
 
2. **Concrete Components:**  
  - Implement sample components like `TextBox`, `ListView`, and `Button`.
 
  - Each component encapsulates its own logic (e.g., `getText()`, `clear()`, `addItem()`).

### C. Developing the Decoupled Renderer 
 
1. **Recursive DOM Creation:** 
  - The Renderer should traverse the virtual DOM tree and create real DOM nodes.

  - Handle both primitive nodes (strings, numbers) and composite components.
 
  - Example pseudocode:

```typescript
function render(virtualNode, container) {
  if (typeof virtualNode === 'string' || typeof virtualNode === 'number') {
    return document.createTextNode(virtualNode);
  }
  if (typeof virtualNode.type === 'function') {
    // Instantiate and render the component
    const componentInstance = new virtualNode.type(virtualNode.props);
    const renderedNode = render(componentInstance.render(), container);
    // Optionally call onAttach if defined
    if (componentInstance.onAttach) {
      componentInstance.onAttach(renderer);
    }
    return renderedNode;
  }
  // For HTML elements:
  const domElement = document.createElement(virtualNode.type);
  updateProps(domElement, virtualNode.props);
  virtualNode.props.children?.forEach(child => {
    domElement.appendChild(render(child, domElement));
  });
  return domElement;
}
```
 
2. **Implementing Hydration:**  
  - Develop a `hydrate()` method that attaches event listeners to an existing DOM based on the virtual DOM.

  - Map existing DOM nodes to their virtual counterparts, then update attributes and event bindings.
 
3. **Incremental Updates & Diffing:** 
  - Write a diffing algorithm that compares the new virtual DOM with the current DOM and applies only the necessary changes.

  - Use a simple strategy: update properties, replace nodes if types differ, and reconcile children via index matching.
 
4. **Event Management:** 
  - Maintain a mapping of event listeners (using a WeakMap for DOM elements) to efficiently add/remove event handlers.

  - Allow components to define their own event callbacks, which are registered during the render phase.

### D. Event-Driven Updates 
 
1. **Explicit Notification:**  
  - Components call `renderer.notify()` or `renderer.refresh()` when their internal state or external data changes.
 
  - This triggers the Renderer to re-run the component’s `render()` method and apply a diff against the existing DOM.
 
2. **Flexible Callback Integration:**  
  - Use standard event listener patterns (e.g., `.addEventListener`) within the Renderer to decouple the event handling from component logic.

  - This approach mirrors the explicit code-behind patterns of WinForms, WPF, and Android.

### E. Supporting Server-Side Rendering (SSR) 
 
1. **Renderer Separation:** 
  - With the Renderer implemented as an independent module, you can use it on the server to generate static HTML.
 
  - On the client, the same Renderer’s `hydrate()` method can be used to attach interactive behavior to the pre-rendered HTML.
 
2. **Consistency & Diffing:** 
  - Ensure that the virtual DOM generated on the client matches the pre-rendered HTML for seamless hydration.

  - Implement error handling and reconciliation strategies if discrepancies arise.


---


## Final Implementation Roadmap 
 
1. **Define Data Structures:** 
  - VirtualNode interface, component base class, and helper types.
 
2. **Implement the h Function:** 
  - Build the function to parse JSX into VirtualNodes.
 
3. **Develop Base and Sample Components:** 
  - Create the App component, along with sample widgets (TextBox, ListView, Button).
 
4. **Build the Renderer Module:**  
  - Implement the `render()`, `hydrate()`, and `refresh()` methods.

  - Incorporate event binding and mapping strategies.
 
5. **Integrate Event Notification:** 
  - Use explicit update calls from components (triggered by user actions) to refresh the UI.
 
6. **Test Incremental Updates and Hydration:** 
  - Develop unit tests and integration tests to verify that incremental diffing and hydration work as intended.
 
7. **Prepare for SSR:** 
  - Set up a server-side entry point that uses the Renderer to generate HTML, and a client-side entry that hydrates it.


---


## Conclusion 

This high-level implementation strategy outlines a framework that leverages the clarity of declarative JSX for UI composition, while the decoupled Renderer handles DOM creation, incremental updates, and SSR hydration. By using an explicit, event-driven notification system for updates, the framework provides developers full control—much like traditional code-behind systems in WPF or Android—yet remains flexible and modern.

This approach not only supports robust server-side rendering but also ensures that UI updates are efficient and easy to manage, blending the strengths of classic retained-mode, imperative UI systems with modern web development techniques.


# 🎯 High-Level UI Framework Design

## 📦 Overview
This document outlines the high-level design for a UI framework with support for JSX, event-driven updates, server-side rendering (SSR), and customizable rendering behavior. The framework is inspired by patterns found in WinForms, WPF, Android SDK, and VSCode's architecture, blending declarative UI with imperative logic.

---

## 🏛️ Core Components

### 1️⃣ **App Class (Application Entry Point)**
**Role:** Manages application initialization, event handling, and UI composition.

```typescript
class App {
    // Members
    private textBox: TextBox;
    private listView: ListView;
    private renderer?: Renderer;

    // Methods
    constructor()
    onAttach(renderer: Renderer)
    private handleAddClick()
    render(): VirtualNode
}
```

**Responsibilities:**
- Instantiates core components.
- Handles UI interactions (e.g., button clicks).
- Triggers manual updates via `renderer.notify()`.

---
1
### 2️⃣ **Renderer Class (Rendering Engine)**
**Role:** Converts virtual nodes to DOM elements, manages updates, and supports SSR.

```typescript
class Renderer {
    // Members
    private rootComponent: Component;
    private rootElement: HTMLElement;
    private componentMap: Map<Component, HTMLElement>
    private eventMap: WeakMap<Element, Record<string, EventListener>>
    private options: RendererOptions

    // Constructor
    constructor(rootComponent: Component, rootElement: HTMLElement, options?: RendererOptions)

    // Core Methods
    render()
    hydrate()
    notify(component: Component, recursively?: boolean)
    refresh(component: Component)
    removeComponent(component: Component)
    private createDom(node: VirtualNode)
    private updateProps(dom: HTMLElement, props: Record<string, any>)
    private reconcileChildren(parent: HTMLElement, newChildren: VirtualNode[])
}
```

**Responsibilities:**
- Initializes with a root component and DOM element.
- Renders or hydrates the UI on demand.
- `notify()` triggers a recursive re-hydration, updating affected nodes only.
- Supports multiple configuration options (e.g., diffing strategy, debug mode).

**Key Algorithmic Challenges:**
- Efficient virtual DOM diffing.
- Event listener mapping and reattachment during hydration.

---

### 3️⃣ **Component Interface (Abstract Base)**
**Role:** Common contract for all UI components.

```typescript
interface Component {
    render(): VirtualNode;
    onAttach?(renderer: Renderer): void;
}
```

**Responsibilities:**
- Enforces a `render()` method.
- Allows optional `onAttach()` lifecycle hook.

---

### 4️⃣ **VirtualNode Structure**
**Role:** Representation of UI structure.

```typescript
interface VirtualNode {
    type: string | Function | Component;
    props: Record<string, any>;
    children?: VirtualNode[];
}
```

**Key Attributes:**
- `type`: Defines element type (HTML tag or component class).
- `props`: Stores properties like event handlers and attributes.
- `children`: Nested elements for hierarchical structures.

---

## 🧩 UI Components

### 🔹 TextBox
```typescript
class TextBox implements Component {
    private inputRef: HTMLInputElement | null;
    getText(): string;
    clear(): void;
    render(): VirtualNode;
}
```
**Role:** Text input field.

### 🔹 ListView
```typescript
class ListView implements Component {
    private items: string[];
    addItem(item: string): void;
    render(): VirtualNode;
}
```
**Role:** Displays a list of items.

### 🔹 Button
```typescript
class Button implements Component {
    private label: string;
    private onClick: () => void;
    render(): VirtualNode;
}
```
**Role:** Interactive button with event handling.

---

## 🔧 Supporting Utilities

### 🛠️ `h()` Function (JSX Factory)
```typescript
function h(type: string | Function, props: Record<string, any>, ...children: any[]): VirtualNode;
```
**Role:** Converts JSX syntax into virtual nodes.

---

### 🔔 EventEmitter
```typescript
class EventEmitter<T = void> {
    private handlers: ((event: T) => void)[];
    on(handler: (event: T) => void): void;
    fire(event: T): void;
    dispose(): void;
}
```
**Role:** Simple pub-sub pattern for custom events.

---

## 🚀 Conceptual Flow

### 1️⃣ Initialization
- **App** creates core components.
- **Renderer** is initialized with the root component and target DOM element.

### 2️⃣ Rendering
- **Renderer.render()** traverses the virtual tree and produces real DOM elements.
- Event listeners are attached using the `eventMap`.

### 3️⃣ Event Handling
- User interactions trigger callbacks (e.g., `onClick`).
- EventEmitter dispatches relevant updates.

### 4️⃣ Dynamic Updates
- `renderer.notify()` initiates re-hydration for components needing updates.
- If `recursively` is `true`, children are also refreshed.

### 5️⃣ SSR Integration
- On the server, `renderer.render()` outputs static HTML.
- On the client, `renderer.hydrate()` binds events to existing DOM.

---

## 🔑 Design Insights

1. **Renderer-Centric Architecture:**
    - The `Renderer` class owns the rendering pipeline, detaching it from component code.
2. **Event-Driven Updates:**
    - Manual event triggering (`notify()`) provides flexibility for various UI models.
3. **Hybrid State Handling:**
    - Simple UIs can rely on imperative component methods, while complex UIs can use ViewModels.
4. **SSR Support:**
    - Hydration logic ensures that pre-rendered content becomes interactive without a full re-render.

---

## ⚙️ Extension Possibilities

- Add `RendererOptions` to configure diffing strategies.
- Optimize `reconcileChildren()` for performance in large trees.
- Introduce `ComponentContext` for dependency injection.

**This framework aims to combine traditional UI patterns with modern web capabilities, emphasizing flexibility, simplicity, and SSR compatibility.**




## 🚦 Design Decisions Explained 

### 🧠 1. Decoupled Renderer 

- Rendering and UI logic are separated into distinct classes.

- The Renderer operates independently, enabling SSR by reusing the same logic server-side to generate static HTML.

- Components are responsible for defining structure and behavior; the Renderer handles DOM operations.

### ⚙️ 2. Imperative Event-Driven Updates 

- No automatic reactivity or data-binding.
 
- Updates occur only when explicitly requested (e.g., `renderer.refresh(this.listView)`).

- EventEmitter provides lightweight, on-demand event dispatching.

### 🌐 3. SSR Compatibility 
 
- The `hydrate()` method reuses server-rendered HTML.

- Only event listeners and dynamic attributes are applied during hydration, improving initial performance.

### 🧩 4. OO-Friendly Design 

- Classes with well-defined methods resemble traditional UI development practices from WPF, WinForms, and Android SDK.
 
- Simple method calls like `getText()`, `addItem()`, or `clear()` feel natural to developers familiar with those frameworks.


---


## 🔍 Flow Recap 
 
1. **Initialization:** 
  - The App is instantiated, and components are constructed.
 
  - The Renderer is attached via `app.onAttach(renderer)`.
 
2. **Rendering:**  
  - `App.render()` is called to generate a virtual tree.
 
  - `Renderer.render()` converts it into DOM nodes.
 
3. **User Interaction:**  
  - Events are captured via event listeners (e.g., `Button.onClick`).
 
  - Components call methods like `listView.addItem()`.
 
4. **Manual UI Updates:**  
  - The component calls `renderer.refresh(listView)`.

  - The Renderer calculates diffs and applies minimal updates to the DOM.
 
5. **SSR & Hydration:**  
  - If static HTML exists, `renderer.hydrate()` attaches listeners and updates the UI accordingly.


---


## 🔑 Key Insights 
 
1. **The Renderer’s Decoupling**  is the heart of this framework. It breaks from the code-behind tradition seen in WPF or Android SDK, giving you SSR capabilities.
 
2. **Explicit Updates via `refresh()`**  shift responsibility to the developer, ensuring no hidden reactivity.
 
3. **JSX Syntax with OO Semantics**  bridges modern declarative layout with imperative, object-oriented logic.


---




# Implementation Bird eye view


Below is a high-level overview of the core classes in your framework, their key members, and how they interact. This serves as an implementation strategy and a roadmap for building your system.


---


## Class Overview and Interactions 
1. **App Component** 
Acts as the central composition unit that brings together UI widgets.


```typescript
// App.tsx
export class App implements Component {
  // --- Members ---
  private textBox: TextBox;         // A widget for user text input.
  private listView: ListView;       // A widget to display a list of items.
  private renderer?: Renderer;      // Reference to the rendering engine (set during attachment).

  // --- Constructor ---
  constructor() {
    this.textBox = new TextBox();
    this.listView = new ListView();
  }

  // --- Lifecycle Method ---
  onAttach(renderer: Renderer): void {
    this.renderer = renderer;
    console.log('App attached to Renderer');
  }

  // --- Event Handler ---
  private handleAddClick(): void {
    const text = this.textBox.getText();
    if (text) {
      this.listView.addItem(text);
      this.textBox.clear();
      // Notify the renderer to update the ListView
      if (this.renderer) {
        this.renderer.refresh(this.listView);
      }
    }
  }

  // --- Render Method ---
  render(): VirtualNode {
    return (
      <div style="padding: 20px; max-width: 600px; margin: auto;">
        {this.textBox}
        <div style="margin: 10px 0;">
          <Button onClick={this.handleAddClick}>Add</Button>
        </div>
        {this.listView}
      </div>
    );
  }
}
```
**Interaction:**  
- **App**  creates instances of **TextBox** , **ListView** , and uses **Button**  (a functional component).
 
- On a button click, it gathers data from **TextBox** , updates **ListView** , clears **TextBox** , and calls the renderer’s `refresh()` method to update the UI.


---

2. **UI Components** 
Modular widgets that encapsulate behavior and presentation.
**TextBox Component** 

```typescript
// TextBox.tsx
export class TextBox implements Component {
  // --- Member ---
  private inputRef: HTMLInputElement | null = null;

  // --- Methods ---
  getText(): string {
    return this.inputRef ? this.inputRef.value : '';
  }

  clear(): void {
    if (this.inputRef) this.inputRef.value = '';
  }

  render(): VirtualNode {
    return (
      <input
        ref={(el) => (this.inputRef = el)}
        type="text"
        placeholder="Enter text..."
        style="padding: 8px; width: 100%;"
      />
    );
  }
}
```
**ListView Component** 

```typescript
// ListView.tsx
export class ListView implements Component {
  // --- Member ---
  private items: string[] = [];

  // --- Methods ---
  addItem(item: string): void {
    this.items.push(item);
  }

  render(): VirtualNode {
    return (
      <ul style="list-style: none; padding: 0; margin-top: 20px;">
        {this.items.map(item => (
          <li style="padding: 10px; background: #f5f5f5; margin-bottom: 5px;">
            {item}
          </li>
        ))}
      </ul>
    );
  }
}
```
**Button Component (Functional)** 

```typescript
// Button.tsx
export function Button({ children, onClick }: { children: string; onClick?: () => void }): VirtualNode {
  return (
    <button class="button" onClick={onClick}>
      {children}
    </button>
  );
}
```
**Interaction:**  
- **TextBox**  and **ListView**  are stateful widgets that expose imperative methods (e.g., `getText()`, `addItem()`) similar to traditional controls.
 
- **Button**  is a lightweight functional component that passes an `onClick` callback to trigger events in **App** .


---

3. **Decoupled Renderer** 
A standalone module that creates, updates, and hydrates the DOM based on a virtual tree.


```typescript
// Renderer.ts
export class Renderer {
  // --- Members ---
  private componentMap = new Map<Component, HTMLElement>(); // Tracks which DOM element belongs to which component.
  private eventListenersMap = new WeakMap<HTMLElement, Record<string, EventListener>>();

  // --- Core Methods ---
  render(element: VirtualNode | string | number | Component): HTMLElement | Text {
    // Recursively convert virtual nodes into DOM nodes.
    // Handle text nodes, functional components, and class-based components.
    // If the element is a component, call its render() method and then track it.
    // Pseudocode:
    // if (typeof element === 'string' or number) { return createTextNode }
    // if (element has render()) { call render() and set up onAttach if available }
    // else { create element based on element.type, set props, and render children }
  }

  hydrate(element: VirtualNode | string | number, container: HTMLElement | Text): void {
    // Attach event listeners and update existing DOM to match the virtual DOM.
  }

  refresh(component: Component): void {
    // Retrieve the existing DOM element from componentMap,
    // re-run component.render(), and diff the new virtual DOM with the current DOM.
  }

  removeComponent(component: Component): void {
    // Remove the DOM element associated with a component.
  }
}
```
**Interaction:**  
- **Renderer**  is called by **App**  (and other components) to build the actual DOM from the virtual DOM generated by `h()` and the components’ `render()` methods.

- It maintains a mapping between components and their DOM elements, enabling efficient updates.
 
- Methods like `render()`, `hydrate()`, and `refresh()` allow the renderer to create the initial DOM, attach behaviors for SSR, and update only the changed portions of the UI.


---

4. **Helper Utilities** **Reasoned for 7 seconds
Below is a high-level overview of the core classes in your framework, their key members, and how they interact. This serves as an implementation strategy and a roadmap for building your system.


---



This code design provides a solid foundation for your UI framework, aligning with your principles while offering a scalable, performant architecture. 🚀
