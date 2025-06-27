// Jest type definitions to override Cypress types in test environment
/// <reference types="jest" />

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveProperty(property: string, value?: any): R;
            toEqual(expected: any): R;
            toContain(item: any): R;
            toHaveBeenCalled(): R;
            toHaveBeenCalledTimes(expected: number): R;
            toHaveBeenCalledWith(...args: any[]): R;
            toThrow(error?: string | RegExp | Error): R;
        }

        interface Expect {
            any(constructor: any): any;
            rejects: {
                toThrow(error?: string | RegExp | Error): Promise<any>;
            };
        }
    }
}

export {};
