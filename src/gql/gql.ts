/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query Countries {\n    countries {\n      name\n      code\n    }\n  }\n": types.CountriesDocument,
};

export function graphql(source: "\n  query Countries {\n    countries {\n      name\n      code\n    }\n  }\n"): (typeof documents)["\n  query Countries {\n    countries {\n      name\n      code\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;