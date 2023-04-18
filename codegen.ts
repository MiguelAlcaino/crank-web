import type { CodegenConfig } from "@graphql-codegen/cli";
import {Config} from "./src/model/Config";

const config: CodegenConfig = {
  overwrite: true,
  schema: Config.GRAPHQL_SERVICE_URL,
  documents: ["src/**/*.vue", "src/**/*.ts"],
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: [],
      config: { nonOptionalTypename: true },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
