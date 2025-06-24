import React, { 
    forwardRef, 
    useImperativeHandle, 
    useEffect,
    ReactNode,
    Ref
} from 'react';
import { 
    IAdvantageWrapper,
    AdvantageFormatName
} from '../types';
import { useAdvantageWrapper } from './hooks.ts';
import { AdvantageWrapperProps, AdvantageWrapperRef } from './types';

/**
 * React wrapper component for the advantage-wrapper web component
 * Provides a React-friendly API while leveraging the existing web component implementation
 * 
 * Follows the API design discussed in email thread for NWT Media integration
 * 
 * Note: Make sure to import the web component definitions before using this component:
 * import '@get-advantage/advantage'  // or your equivalent import
 */
export const AdvantageWrapper = forwardRef<AdvantageWrapperRef, AdvantageWrapperProps>(
    function AdvantageWrapper(
        {
            children,
            className,
            style,
            id,
            allowedFormats,
            excludeFormats,
            onFormatChange,
            onFormatConfirmed,
            onFormatRejected,
            onClose,
            onReset,
            formatIntegrations,
            ...rest
        },
        ref: Ref<AdvantageWrapperRef>
    ) {
        const {
            ref: wrapperRef,
            currentFormat,
            forceFormat,
            reset,
            close,
            simulateFormat,
            setAllowedFormats,
            clearAllowedFormats
        } = useAdvantageWrapper({
            allowedFormats: allowedFormats as AdvantageFormatName[],
            excludeFormats: excludeFormats as AdvantageFormatName[],
            formatIntegrations
        });

        // Expose wrapper methods through ref - matching email thread interface
        useImperativeHandle(ref, () => ({
            forceFormat: async (format, iframe, options) => {
                return forceFormat(format as AdvantageFormatName, iframe, options);
            },
            reset: () => reset(),
            close: () => close(),
            simulateFormat: async (format) => {
                return simulateFormat(format as AdvantageFormatName);
            },
            setAllowedFormats: (formats) => {
                setAllowedFormats(formats as AdvantageFormatName[]);
            },
            clearAllowedFormats: () => clearAllowedFormats(),
        }), [forceFormat, reset, close, simulateFormat, setAllowedFormats, clearAllowedFormats]);

        // Handle format change events
        useEffect(() => {
            if (currentFormat && onFormatChange) {
                onFormatChange(currentFormat);
            }
        }, [currentFormat, onFormatChange]);

        // Set up event listeners for advantage-specific events
        useEffect(() => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            const handleFormatConfirmed = (event: CustomEvent) => {
                onFormatConfirmed?.(event.detail.format);
            };

            const handleFormatRejected = (event: CustomEvent) => {
                onFormatRejected?.(event.detail.format);
            };

            const handleClose = () => {
                onClose?.();
            };

            const handleReset = () => {
                onReset?.();
            };

            // Add event listeners (these would need to be implemented in the web component)
            wrapper.addEventListener('advantage:format-confirm', handleFormatConfirmed as EventListener);
            wrapper.addEventListener('advantage:format-reject', handleFormatRejected as EventListener);
            wrapper.addEventListener('advantage:close', handleClose);
            wrapper.addEventListener('advantage:reset', handleReset);

            return () => {
                wrapper.removeEventListener('advantage:format-confirm', handleFormatConfirmed as EventListener);
                wrapper.removeEventListener('advantage:format-reject', handleFormatRejected as EventListener);
                wrapper.removeEventListener('advantage:close', handleClose);
                wrapper.removeEventListener('advantage:reset', handleReset);
            };
        }, [onFormatConfirmed, onFormatRejected, onClose, onReset]);

        // Prepare attributes for the web component
        const wrapperProps: any = {
            ref: wrapperRef,
            style,
            id,
            ...rest
        };

        // Handle className properly for custom elements
        // Alexander's concern: React serializes props to strings for custom elements
        if (className) {
            wrapperProps.class = className; // Use 'class' instead of 'className' for custom elements
        }

        // Add format attributes
        if (allowedFormats && allowedFormats.length > 0) {
            wrapperProps['allowed-formats'] = allowedFormats.join(', ');
        }

        if (excludeFormats && excludeFormats.length > 0) {
            wrapperProps['exclude-formats'] = excludeFormats.join(', ');
        }

        return React.createElement(
            'advantage-wrapper',
            wrapperProps,
            React.createElement(
                'div',
                { slot: 'advantage-ad-slot' },
                children
            )
        );
    }
);

AdvantageWrapper.displayName = 'AdvantageWrapper';

// Additional helper components for better DX

/**
 * Wrapper for ad slot content
 */
export const AdvantageAdSlot: React.FC<{ children: ReactNode; className?: string }> = ({ 
    children, 
    className 
}) => React.createElement(
    'div',
    { slot: 'advantage-ad-slot', className },
    children
);

/**
 * Wrapper for UI layer content  
 */
export const AdvantageUIContent: React.FC<{ children: ReactNode; className?: string }> = ({ 
    children, 
    className 
}) => React.createElement(
    'div',
    { slot: 'advantage-ui-content', className },
    children
);

/**
 * Higher-order component for automatic Advantage configuration
 * Returns a compatible React component
 */
export function withAdvantageConfig<P extends object>(
    Component: React.ComponentType<P>,
    config: any
) {
    const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
        useEffect(() => {
            // Dynamically import and configure Advantage
            import('../advantage').then(({ Advantage }) => {
                const advantage = Advantage.getInstance();
                advantage.configure(config);
            }).catch(error => {
                console.warn('Failed to load Advantage configuration:', error);
            });
        }, []);

        return React.createElement(Component, { ...props, ref } as P & { ref: any });
    });

    WrappedComponent.displayName = `withAdvantageConfig(${Component.displayName || Component.name})`;
    
    // Return as unknown first to bypass strict type checking, then cast to the desired type
    return WrappedComponent as unknown as React.ComponentType<P>;
}

export default AdvantageWrapper;

// Export types for consumers
export type { AdvantageWrapperProps, AdvantageWrapperRef } from './types';