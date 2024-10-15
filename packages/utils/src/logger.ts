class Logger {
  disableAll: boolean;

  constructor(disableAll: boolean) {
    this.disableAll = disableAll;
  }

  public info(message: any, ...optionalParams: any[]) {
    if (!this.disableAll && process.env.NODE_ENV !== "production")
      console.info(message, ...optionalParams);
  }

  public debug(message: any, ...optionalParams: any[]) {
    if (!this.disableAll && process.env.NODE_ENV !== "production")
      console.debug(message, ...optionalParams);
  }

  public warn(message: any, ...optionalParams: any[]) {
    if (!this.disableAll) console.warn(message, ...optionalParams);
  }

  public error(message: any, ...optionalParams: any[]) {
    if (!this.disableAll && (import.meta as any).env?.MODE !== "production") // Disabled only on the client.
      console.error(message, ...optionalParams);
  }
}

const logger = new Logger(false);

export { logger };
