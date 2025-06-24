import { ReactNode, CSSProperties } from 'react';
import { 
    AdvantageFormatName, 
    AdvantageFormatOptions, 
    IAdvantageWrapper,
    AdvantageFormatIntegration as CoreAdvantageFormatIntegration
} from '../types';

export interface AdvantageWrapperProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    id?: string;
    
    // Advantage-specific props
    allowedFormats?: (AdvantageFormatName | string)[];
    excludeFormats?: (AdvantageFormatName | string)[];
    
    // Event handlers - Following email thread naming convention
    onFormatChange?: (format: AdvantageFormatName | string) => void;
    onFormatConfirmed?: (format: AdvantageFormatName | string) => void;
    onFormatRejected?: (format: AdvantageFormatName | string) => void;
    onClose?: () => void;
    onReset?: () => void;
    
    // Format integration options
    formatIntegrations?: CoreAdvantageFormatIntegration[];
}

export interface AdvantageWrapperRef {
    forceFormat: (
        format: AdvantageFormatName | string,
        iframe?: HTMLIFrameElement,
        options?: any
    ) => Promise<void>;
    reset: () => void;
    close: () => void;
    simulateFormat: (format: AdvantageFormatName | string) => Promise<void>;
    setAllowedFormats: (formats: (AdvantageFormatName | string)[]) => void;
    clearAllowedFormats: () => void;
}

export interface UseAdvantageWrapperOptions {
    allowedFormats?: (AdvantageFormatName | string)[];
    excludeFormats?: (AdvantageFormatName | string)[];
    formatIntegrations?: CoreAdvantageFormatIntegration[];
}

export interface UseAdvantageWrapperReturn {
    ref: React.RefObject<IAdvantageWrapper | null>;
    currentFormat: AdvantageFormatName | string | undefined;
    isLoading: boolean;
    error: string | null;
    forceFormat: (
        format: AdvantageFormatName | string,
        iframe?: HTMLIFrameElement,
        options?: any
    ) => Promise<void>;
    simulateFormat: (format: AdvantageFormatName | string) => Promise<void>;
    reset: () => void;
    close: () => void;
    setAllowedFormats: (formats: (AdvantageFormatName | string)[]) => void;
    clearAllowedFormats: () => void;
}

// Extend the HTMLElement interface for advantage-wrapper
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'advantage-wrapper': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'allowed-formats'?: string;
                'exclude-formats'?: string;
            };
            'advantage-ui-layer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}