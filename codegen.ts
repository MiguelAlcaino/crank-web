import type { CodegenConfig } from '@graphql-codegen/cli'
import { loadEnv } from 'vite'

const env = loadEnv('development', process.cwd(), '')

const config: CodegenConfig = {
  overwrite: true,
  schema: env.VITE_CRANK_GRAPHQL_SERVER_URL,
  documents: ['src/**/*.ts', 'src/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/fragment-types.json': {
      plugins: ['@graphql-codegen/fragment-matcher']
    },

    'src/gql/graphql.ts': {
      config: {
        useTypeImports: true
      },
      plugins: [
        'typescript',
        {
          'typescript-operations': {
            preResolveTypes: true,
            nonOptionalTypename: true,
            useTypeImports: true
          }
        },
        'typed-document-node'
      ]
    },
    './graphql.schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
