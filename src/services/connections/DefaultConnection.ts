import { Configuration, registerProvider } from "@tsed/di";
import { createConnection } from "@tsed/typeorm";
import { Connection, ConnectionOptions } from "typeorm";

export const DEFAULT_CONNECTION = Symbol.for("DEFAULT_CONNECTION");
export type DEFAULT_CONNECTION = Connection;
export const CONECTION_NAME = "default";

registerProvider({
  provide: DEFAULT_CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const settings = configuration.get<ConnectionOptions[]>("typeorm")!;
    const connectionOptions = settings.find((o) => o.name === CONECTION_NAME);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return createConnection(connectionOptions!);
  }
});
