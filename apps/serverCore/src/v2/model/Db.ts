import { type ConnectOptions, connect } from "mongoose";
import { logger } from "@qc/utils";

const { DATABASE_URI_BASE, DATABASE_URI_GAME } = process.env;

export default class Db {
  options: ConnectOptions;

  constructor(options?: ConnectOptions) {
    const ops = options ? { ...options } : {};

    this.options = {
      ...ops,
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
        ...((ops?.serverApi as object) ?? {}),
      },
    };
  }

  async connectBaseCluster() {
    try {
      await connect(DATABASE_URI_BASE || "", this.options);
    } catch (error: any) {
      logger.error("baseDB connection error:\n", error.message);
    }
  }

  async connectGameCluster() {
    try {
      await connect(DATABASE_URI_GAME || "", this.options);
    } catch (error: any) {
      logger.error("gameDB connection error:\n", error.message);
    }
  }
}
