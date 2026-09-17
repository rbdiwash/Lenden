/// <reference types="nativewind/types" />

// Metro turns `global.css` into a side-effect import that TypeScript cannot
// resolve on its own; NativeWind consumes it at build time.
declare module '*.css';
