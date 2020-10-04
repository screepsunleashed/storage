declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_PATH: string;
            STORAGE_PORT: string;
        }
    }
}

export { };