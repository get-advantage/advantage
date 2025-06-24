import { useRef, useEffect, useState, useCallback } from 'react';
import { 
    AdvantageFormatName,
    IAdvantageWrapper 
} from '../types';
import { UseAdvantageWrapperOptions } from './types';

/**
 * React hook for managing an advantage-wrapper element
 * @param options Configuration options for the wrapper
 * @returns Object containing wrapper ref and control methods
 */
export function useAdvantageWrapper(options: UseAdvantageWrapperOptions = {}) {
    const ref = useRef<IAdvantageWrapper | null>(null);
    const [currentFormat, setCurrentFormat] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize wrapper and monitor format changes
    useEffect(() => {
        const wrapper = ref.current;
        if (!wrapper) return;

        let cleanup: (() => void) | null = null;
        let isInitialized = false;

        // Function to initialize wrapper when ready
        const initializeWrapper = () => {
            if (isInitialized) return; // Prevent multiple initializations
            
            const advantageWrapper = wrapper as IAdvantageWrapper;

            // Check if the wrapper is ready (not in loading state)
            if (!advantageWrapper) {
                // If not ready, wait a bit and try again
                setTimeout(initializeWrapper, 10);
                return;
            }
            
            // Check if the wrapper has the required methods (indicating it's fully initialized)
            if (typeof advantageWrapper.setAllowedFormats !== 'function') {
                // If not ready, wait a bit and try again
                setTimeout(initializeWrapper, 10);
                return;
            }

            isInitialized = true;

            // Set allowed formats if provided
            if (options.allowedFormats) {
                advantageWrapper.setAllowedFormats(options.allowedFormats);
            }

            // Set exclude formats if provided via attribute
            if (options.excludeFormats) {
                advantageWrapper.setAttribute('exclude-formats', options.excludeFormats.join(', '));
            }

            // Monitor format changes with circuit breaker to prevent infinite loops
            let pollingInterval: number;
            let debounceTimer: number;
            let lastFormat = advantageWrapper.currentFormat;
            let formatChangeCount = 0;
            const MAX_FORMAT_CHANGES = 3; // Circuit breaker
            
            const pollFormatChanges = () => {
                if (!isInitialized) return;
                if (formatChangeCount >= MAX_FORMAT_CHANGES) {
                    console.log('🛑 Circuit breaker: Stopping format change detection to prevent infinite loop');
                    return;
                }
                
                const currentFormat = advantageWrapper.currentFormat;
                if (currentFormat !== lastFormat) {
                    formatChangeCount++;
                    console.log(`🔍 Format change detected (${formatChangeCount}/${MAX_FORMAT_CHANGES}):`, lastFormat, '→', currentFormat);
                    
                    // Clear any existing debounce timer
                    if (debounceTimer) {
                        window.clearTimeout(debounceTimer);
                    }
                    
                    // Debounce the format change to prevent rapid fire changes
                    debounceTimer = window.setTimeout(() => {
                        setCurrentFormat(currentFormat);
                        lastFormat = currentFormat;
                    }, 100); // 100ms debounce
                }
            };
            
            // Try MutationObserver first, fall back to polling if it fails
            try {
                if (advantageWrapper instanceof Node) {
                    const observer = new MutationObserver(() => {
                        pollFormatChanges();
                    });

                    observer.observe(advantageWrapper, {
                        attributes: true,
                        attributeFilter: ['currentFormat']
                    });

                    // Store cleanup function
                    cleanup = () => {
                        isInitialized = false;
                        observer.disconnect();
                        if (pollingInterval) {
                            window.clearInterval(pollingInterval);
                        }
                        if (debounceTimer) {
                            window.clearTimeout(debounceTimer);
                        }
                    };
                } else {
                    throw new Error('Not a valid Node');
                }
            } catch (error) {
                console.warn('AdvantageWrapper: MutationObserver failed, falling back to polling:', error);
                
                // Fallback to polling every 1000ms (less frequent to avoid conflicts with production ads)
                pollingInterval = window.setInterval(pollFormatChanges, 1000);
                
                // Store cleanup function
                cleanup = () => {
                    isInitialized = false;
                    if (pollingInterval) {
                        window.clearInterval(pollingInterval);
                    }
                    if (debounceTimer) {
                        window.clearTimeout(debounceTimer);
                    }
                };
            }
            
            // Initial format check
            pollFormatChanges();
        };

        // If the element is a custom element that's not yet upgraded, wait for it
        if (wrapper && wrapper.tagName && wrapper.tagName.toLowerCase() === 'advantage-wrapper' && !customElements.get('advantage-wrapper')) {
            // Wait for the custom element to be defined
            customElements.whenDefined('advantage-wrapper').then(() => {
                // Add a small delay to ensure the element is fully ready
                setTimeout(initializeWrapper, 50);
            });
        } else {
            // Element is ready or already upgraded - but add a small delay for DOM settling
            setTimeout(initializeWrapper, 10);
        }

        // Cleanup on unmount
        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [options.allowedFormats, options.excludeFormats]);

    const forceFormat = useCallback(async (format: AdvantageFormatName, iframe?: HTMLIFrameElement, options?: any) => {
        const wrapper = ref.current;
        if (!wrapper) {
            throw new Error('Wrapper not available');
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            await wrapper.forceFormat(format, iframe, options);
            setCurrentFormat(format);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const simulateFormat = useCallback(async (format: AdvantageFormatName) => {
        const wrapper = ref.current;
        if (!wrapper) {
            throw new Error('Wrapper not available');
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            await wrapper.simulateFormat(format);
            setCurrentFormat(format);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        const wrapper = ref.current;
        if (!wrapper) return;
        
        setCurrentFormat(undefined);
        setError(null);
        wrapper.reset();
    }, []);

    const close = useCallback(() => {
        const wrapper = ref.current;
        if (!wrapper) return;
        
        setCurrentFormat(undefined);
        wrapper.close();
    }, []);

    const setAllowedFormats = useCallback((formats: AdvantageFormatName[]) => {
        const wrapper = ref.current as IAdvantageWrapper;
        if (!wrapper) return;
        
        wrapper.setAllowedFormats(formats);
    }, []);

    const clearAllowedFormats = useCallback(() => {
        const wrapper = ref.current as IAdvantageWrapper;
        if (!wrapper) return;
        
        wrapper.clearAllowedFormats();
    }, []);

    return {
        ref,
        currentFormat,
        isLoading,
        error,
        forceFormat,
        simulateFormat,
        reset,
        close,
        setAllowedFormats,
        clearAllowedFormats
    };
}

/**
 * React hook for global Advantage configuration
 * @param config Advantage configuration
 */
export function useAdvantageConfig(config: any = {}) {
    useEffect(() => {
        // Initialize Advantage instance with format integrations
        if (typeof window !== 'undefined' && (window as any).Advantage) {
            const advantage = (window as any).Advantage;
            
            // Apply configuration
            if (config.formatIntegrations) {
                advantage.formatIntegrations = config.formatIntegrations;
            }
        }
    }, [config]);

    return {};
}