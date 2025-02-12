declare namespace JSX {
    interface CustomProps {
        [key: string]: any;
        children?: CustomElement[];
    }

    interface CustomElement {
        type: string;
        props: CustomProps;
    }

    interface Element extends CustomElement {}

    interface IntrinsicElements {
        // Main root
        html: CustomProps;
        
        // Document metadata
        base: CustomProps;
        head: CustomProps;
        link: CustomProps;
        meta: CustomProps;
        style: CustomProps;
        title: CustomProps;

        // Content sectioning
        address: CustomProps;
        article: CustomProps;
        aside: CustomProps;
        footer: CustomProps;
        header: CustomProps;
        h1: CustomProps;
        h2: CustomProps;
        h3: CustomProps;
        h4: CustomProps;
        h5: CustomProps;
        h6: CustomProps;
        main: CustomProps;
        nav: CustomProps;
        section: CustomProps;

        // Text content
        blockquote: CustomProps;
        dd: CustomProps;
        div: CustomProps;
        dl: CustomProps;
        dt: CustomProps;
        figcaption: CustomProps;
        figure: CustomProps;
        hr: CustomProps;
        li: CustomProps;
        ol: CustomProps;
        p: CustomProps;
        pre: CustomProps;
        ul: CustomProps;

        // Inline text semantics
        a: CustomProps;
        abbr: CustomProps;
        b: CustomProps;
        br: CustomProps;
        cite: CustomProps;
        code: CustomProps;
        em: CustomProps;
        i: CustomProps;
        mark: CustomProps;
        q: CustomProps;
        s: CustomProps;
        small: CustomProps;
        span: CustomProps;
        strong: CustomProps;
        sub: CustomProps;
        sup: CustomProps;
        time: CustomProps;

        // Image and multimedia
        area: CustomProps;
        audio: CustomProps;
        img: CustomProps;
        map: CustomProps;
        track: CustomProps;
        video: CustomProps;

        // Forms
        button: CustomProps;
        datalist: CustomProps;
        fieldset: CustomProps;
        form: CustomProps;
        input: CustomProps;
        label: CustomProps;
        legend: CustomProps;
        meter: CustomProps;
        optgroup: CustomProps;
        option: CustomProps;
        output: CustomProps;
        progress: CustomProps;
        select: CustomProps;
        textarea: CustomProps;

        // Table content
        caption: CustomProps;
        col: CustomProps;
        colgroup: CustomProps;
        table: CustomProps;
        tbody: CustomProps;
        td: CustomProps;
        tfoot: CustomProps;
        th: CustomProps;
        thead: CustomProps;
        tr: CustomProps;

        // Interactive elements
        details: CustomProps;
        dialog: CustomProps;
        menu: CustomProps;
        summary: CustomProps;

        // Web Components
        slot: CustomProps;
        template: CustomProps;
    }
}

export = JSX;
export as namespace JSX;
