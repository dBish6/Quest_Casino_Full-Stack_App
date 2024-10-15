import { type ConnectOptions, connect } from "mongoose";
import { logger } from "@qc/utils";

const { DATABASE_URI_BASE, DATABASE_URI_GAME, NODE_ENV } = process.env;

export default class Db {
  public options: ConnectOptions;

  constructor(options?: ConnectOptions) {
    const ops = options ? { ...options } : {};

    this.options = {
      ...ops,
      ...(NODE_ENV === "production" && { autoIndex: false }), // This is recommended, don't know if this would break everything.
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
        ...((ops?.serverApi as object) ?? {}),
      },
    };
  }

  public async connectBaseCluster() {
    try {
      await connect(DATABASE_URI_BASE || "", this.options);
      logger.info("MongoDB connection established via baseDB!");
    } catch (error: any) {
      logger.error("baseDB connection error:\n", error.message);
    }
  }

  // async connectGameCluster() {
  //   try {
  //     await connect(DATABASE_URI_GAME || "", this.options);
  //   } catch (error: any) {
  //     logger.error("gameDB connection error:\n", error.message);
  //   }
  // }
}
