import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnv } from "vite";

const env = loadEnv('development', process.cwd(), '')
const config: CodegenConfig = {
  overwrite: true,
  schema: env.VITE_CRANK_GRAPHQL_SERVER_URL,
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
