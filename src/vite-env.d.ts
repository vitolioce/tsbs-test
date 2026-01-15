/// <reference types="vite/client" />

// Permette l'import di file JSON per animazioni Lottie
declare module '*.json' {
  const value: any;
  export default value;
}

