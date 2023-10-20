declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_DB?: string;
    POSTGRES_USER?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_PORT?: string;
    TCD_UID?: string;
    TCD_SECRET?: string;
    TCD_CALLBACKURL?: string;
  }
}