
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL ou prefixo da API. */
  readonly VITE_API_URL?: string;

  /** Host exibido na barra de status (padrão: localhost:8080). */
  readonly VITE_API_HOST?: string;

  /** Destino do proxy do Vite em desenvolvimento (padrão: http://localhost:8080). */
  readonly VITE_API_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
