export interface CustomProps {
    [key: string]: any;
    children?: any[];
    ref?: (element: HTMLElement) => void;
}

export interface CustomElement {
    type: string | Function;
    props: CustomProps;
}

export interface ButtonProps {
    onClick: () => void;
    children: any;
}

declare global {
    namespace JSX {
        interface Element extends CustomElement {}
        interface IntrinsicElements {
            div: CustomProps;
            h1: CustomProps;
            p: CustomProps;
            button: CustomProps;
            span: CustomProps;
        }
    }
}
