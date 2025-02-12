import { CustomElement, CustomProps } from './types';

export function h(type: string | Function, props: CustomProps | null, ...children: any[]): CustomElement {
    return {
        type,
        props: {
            ...(props || {}),
            children: children.flat().filter(child => child != null)
        }
    };
}

export function render(element: CustomElement | string | number): HTMLElement | Text {
    // Handle primitive types
    if (typeof element === 'string' || typeof element === 'number') {
        return document.createTextNode(element.toString());
    }

    // Handle components
    if (typeof element.type === 'function') {
        let result;
        // Check if it's a class constructor
        if (/^\s*class\s+/.test(element.type.toString())) {
            const instance = new element.type(element.props);
            result = instance.render();
        } else {
            // Function component
            result = element.type(element.props);
        }
        return render(result);
    }

    // Handle DOM elements
    const domElement = document.createElement(element.type as string);

    // Add properties to the element
    Object.entries(element.props).forEach(([name, value]) => {
        if (name === 'children') return;
        if (name === 'ref' && typeof value === 'function') {
            value(domElement);
        } else if (name.startsWith('on') && typeof value === 'function') {
            const eventName = name.toLowerCase().substring(2);
            domElement.addEventListener(eventName, value);
        } else if (name === 'className') {
            domElement.setAttribute('class', value);
        } else if (name === 'style') {
            domElement.setAttribute('style', value);
        } else {
            domElement.setAttribute(name, value);
        }
    });

    // Render children
    if (element.props.children) {
        element.props.children.forEach(child => {
            if (child != null) {
                domElement.appendChild(render(child));
            }
        });
    }

    return domElement;
}

export function renderToString(element: CustomElement | string | number): string {
    // Handle primitive types
    if (typeof element === 'string' || typeof element === 'number') {
        return element.toString();
    }

    // Handle components
    if (typeof element.type === 'function') {
        let result;
        // Check if it's a class constructor
        if (/^\s*class\s+/.test(element.type.toString())) {
            const instance = new element.type(element.props);
            result = instance.render();
        } else {
            // Function component
            result = element.type(element.props);
        }
        return renderToString(result);
    }

    // Handle DOM elements
    const tag = element.type as string;
    const props = element.props || {};
    
    // Build props string
    let propsString = '';
    Object.entries(props).forEach(([name, value]) => {
        if (name === 'children') return;
        if (name === 'className') {
            propsString += ` class="${value}"`;
        } else if (name === 'style' && typeof value === 'object') {
            const styleString = Object.entries(value)
                .map(([key, val]) => `${key}:${val}`)
                .join(';');
            propsString += ` style="${styleString}"`;
        } else if (!name.startsWith('on')) { // Skip event handlers
            propsString += ` ${name}="${value}"`;
        }
    });

    // Handle self-closing tags
    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    if (selfClosingTags.includes(tag)) {
        return `<${tag}${propsString} />`;
    }

    // Handle children
    let childrenString = '';
    if (props.children) {
        childrenString = props.children
            .filter((child: any) => child != null)
            .map((child: any) => renderToString(child))
            .join('');
    }

    return `<${tag}${propsString}>${childrenString}</${tag}>`;
}

const DEBUG = false;

function log(...args: any[]) {
    if (DEBUG) console.log('[Hydrate]:', ...args);
}

const eventListenersMap = new WeakMap<HTMLElement, Record<string, EventListener>>();

function updateProps(domElement: HTMLElement, props: Record<string, any>) {
    const previousListeners = eventListenersMap.get(domElement) || {};
    const newListeners: Record<string, EventListener> = {};

    Object.entries(props).forEach(([name, value]) => {
        if (name === 'children') return;

        if (name.startsWith('on') && typeof value === 'function') {
            const eventName = name.toLowerCase().substring(2);
            if (previousListeners[eventName]) {
                domElement.removeEventListener(eventName, previousListeners[eventName]);
            }
            domElement.addEventListener(eventName, value);
            newListeners[eventName] = value;
        } else if (name === 'className') {
            if (domElement.className !== value) {
                domElement.className = value;
            }
        } else if (name === 'style') {
            if (typeof value === 'string' && domElement.getAttribute('style') !== value) {
                domElement.setAttribute('style', value);
            } else if (typeof value === 'object') {
                Object.assign(domElement.style, value);
            }
        } else if (name !== 'ref') {
            const currentValue = domElement.getAttribute(name);
            if (currentValue !== value?.toString()) {
                domElement.setAttribute(name, value);
            }
        }
    });

    eventListenersMap.set(domElement, newListeners);

    // Handle ref after all other props are set
    if (props.ref && typeof props.ref === 'function') {
        props.ref(domElement);
    }
}

function reconcileChildren(parent: HTMLElement, newChildren: any[]) {
    const existingChildren = Array.from(parent.childNodes);
    const maxLen = Math.max(newChildren.length, existingChildren.length);

    for (let i = 0; i < maxLen; i++) {
        const newChild = newChildren[i];
        const existingChild = existingChildren[i];

        if (newChild == null && existingChild) {
            existingChild.remove();
        } else if (newChild != null && !existingChild) {
            parent.appendChild(render(newChild));
        } else if (newChild != null && existingChild) {
            hydrate(newChild, existingChild as HTMLElement | Text);
        }
    }
}

export function hydrate(element: CustomElement | string | number, container: HTMLElement | Text) {
    try {
        if (typeof element === 'string' || typeof element === 'number') {
            if (!(container instanceof Text)) {
                const parent = container.parentNode;
                const textNode = document.createTextNode(element.toString());
                if (parent) {
                    parent.replaceChild(textNode, container);
                }
            } else if (container.textContent !== element.toString()) {
                container.textContent = element.toString();
            }
            return;
        }

        if (typeof element.type === 'function') {
            let result;
            if (/^\s*class\s+/.test(element.type.toString())) {
                const instance = new element.type(element.props);
                result = instance.render();
            } else {
                result = element.type(element.props);
            }
            hydrate(result, container);
            return;
        }

        if (!(container instanceof HTMLElement)) {
            throw new Error('Container must be an HTMLElement for non-text nodes');
        }

        if (container.tagName.toLowerCase() !== (element.type as string).toLowerCase()) {
            const parent = container.parentNode;
            const newNode = render(element);
            if (parent) {
                parent.replaceChild(newNode, container);
            }
            return;
        }

        updateProps(container, element.props);
        reconcileChildren(container, element.props.children || []);

    } catch (error) {
        console.error('Hydration error:', error);
        const parent = container.parentNode;
        if (parent) {
            const newNode = render(element);
            parent.replaceChild(newNode, container);
        }
    }
}
