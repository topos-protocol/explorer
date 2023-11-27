/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Certificate($certificateId: CertificateId!) {\n    certificate(certificateId: $certificateId) {\n      prevId\n      id\n      proof\n      signature\n      sourceSubnetId {\n        value\n      }\n      stateRoot\n      targetSubnets {\n        value\n      }\n      receiptsRootHash\n      txRootHash\n      verifier\n    }\n  }\n": types.CertificateDocument,
    "\n  query Certificates($fromSourceCheckpoint: SourceCheckpoint!, $limit: Int!) {\n    certificates(fromSourceCheckpoint: $fromSourceCheckpoint, first: $limit) {\n      prevId\n      id\n      proof\n      signature\n      sourceSubnetId {\n        value\n      }\n      stateRoot\n      targetSubnets {\n        value\n      }\n      receiptsRootHash\n      txRootHash\n      verifier\n    }\n  }\n": types.CertificatesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Certificate($certificateId: CertificateId!) {\n    certificate(certificateId: $certificateId) {\n      prevId\n      id\n      proof\n      signature\n      sourceSubnetId {\n        value\n      }\n      stateRoot\n      targetSubnets {\n        value\n      }\n      receiptsRootHash\n      txRootHash\n      verifier\n    }\n  }\n"): (typeof documents)["\n  query Certificate($certificateId: CertificateId!) {\n    certificate(certificateId: $certificateId) {\n      prevId\n      id\n      proof\n      signature\n      sourceSubnetId {\n        value\n      }\n      stateRoot\n      targetSubnets {\n        value\n      }\n      receiptsRootHash\n      txRootHash\n      verifier\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Certificates($fromSourceCheckpoint: SourceCheckpoint!, $limit: Int!) {\n    certificates(fromSourceCheckpoint: $fromSourceCheckpoint, first: $limit) {\n      prevId\n      id\n      proof\n      signature\n      sourceSubnetId {\n        value\n      }\n      stateRoot\n      targetSubnets {\n        value\n      }\n      receiptsRootHash\n      txRootHash\n      verifier\n    }\n  }\n"): (typeof documents)["\n  query Certificates($fromSourceCheckpoint: SourceCheckpoint!, $limit: Int!) {\n    certificates(fromSourceCheckpoint: $fromSourceCheckpoint, first: $limit) {\n      prevId\n      id\n      proof\n      signature\n      sourceSubnetId {\n        value\n      }\n      stateRoot\n      targetSubnets {\n        value\n      }\n      receiptsRootHash\n      txRootHash\n      verifier\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;