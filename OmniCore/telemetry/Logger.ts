// [PURIFIED_BY_AETERNA: 76aa7b98-535e-4d1d-9dcb-22f2d6e788ec]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: d9081441-9269-4124-aaed-9335b947ae9e]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 40b3f867-5cfe-47d1-8f37-47899d261979]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 40b3f867-5cfe-47d1-8f37-47899d261979]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: d2261847-d768-453f-ab77-277663df3229]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: a5a2b521-d06e-4fec-971b-58f6d467c261]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: a5a2b521-d06e-4fec-971b-58f6d467c261]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 754de4ea-9876-4e39-9f76-92e267c3e3a3]
// Suggestion: Review and entrench stable logic.
export class Logger {
    private static instance: Logger;

    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public debug(context: string, message: string, ...args: any[]): void {
        console.debug(`[DEBUG][${context}] ${message}`, ...args);
    }

    public info(context: string, message: string, ...args: any[]): void {
        console.info(`[INFO][${context}] ${message}`, ...args);
    }

    public warn(context: string, message: string, ...args: any[]): void {
        console.warn(`[WARN][${context}] ${message}`, ...args);
    }

    public error(context: string, message: string, error?: any): void {
        console.error(`[ERROR][${context}] ${message}`, error);
    }
}
