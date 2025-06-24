interface Window {
    ucTagData?: {
        targetingMap?: any;
    };
}

// JSX declarations for our custom web components
declare namespace JSX {
    interface IntrinsicElements {
        'advantage-wrapper': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            'allowed-formats'?: string;
            'exclude-formats'?: string;
        };
        'advantage-ui-layer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}
