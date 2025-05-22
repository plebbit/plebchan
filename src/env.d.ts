/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_COMMIT_REF: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
