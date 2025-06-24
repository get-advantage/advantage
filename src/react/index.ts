// React components
export { default as AdvantageWrapper, AdvantageAdSlot, AdvantageUIContent, withAdvantageConfig } from './AdvantageWrapper';

// React hooks
export { useAdvantageWrapper, useAdvantageConfig } from './hooks';

// Types
export type {
    AdvantageWrapperProps,
    AdvantageWrapperRef,
    UseAdvantageWrapperOptions,
    UseAdvantageWrapperReturn
} from './types';

// Re-export core types that are commonly used in React components
export type {
    AdvantageFormatName,
    AdvantageFormatOptions,
    AdvantageMessage,
    IAdvantageWrapper,
    AdvantageConfig
} from '../types';