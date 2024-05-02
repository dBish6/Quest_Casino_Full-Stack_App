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
