// Temporary React compatibility fix for demo
declare module 'react' {
  interface ReactNode {
    readonly _bigint?: never;
  }
}

export {};
