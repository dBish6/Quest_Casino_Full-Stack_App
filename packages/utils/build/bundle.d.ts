/**
 * Capitalizes each word in a string that is in snake case.
 */
export declare function capitalize(txt: string): string;

export declare const delay: (ms: number, callback?: () => void) => Promise<void>;

declare class Logger {
    disableAll: boolean;
    constructor(disableAll: boolean);
    info(message: any, ...optionalParams: any[]): void;
    debug(message: any, ...optionalParams: any[]): void;
    warn(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): void;
}
declare const logger: Logger;
export { logger };

/**
 * Constraints:
 * - Valid email format.
 */
export declare function validateEmail(email: string): "Invalid email." | undefined;

