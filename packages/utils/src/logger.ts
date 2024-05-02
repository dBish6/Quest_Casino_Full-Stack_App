class Logger {
  disableAll: boolean;

  constructor(disableAll: boolean) {
    this.disableAll = disableAll;
  }

  info(message: any, ...optionalParams: any[]) {
    if (!this.disableAll && process.env.NODE_ENV !== "production")
      console.info(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (!this.disableAll && process.env.NODE_ENV !== "production")
      console.debug(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    if (!this.disableAll) console.warn(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    if (!this.disableAll) console.error(message, ...optionalParams);
  }
}

const logger = new Logger(false);

export { logger };
