/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Certificate = {
  __typename?: 'Certificate';
  id: Scalars['String']['output'];
  prevId: Scalars['String']['output'];
  proof: Scalars['String']['output'];
  receiptsRootHash: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  sourceSubnetId: Scalars['String']['output'];
  stateRoot: Scalars['String']['output'];
  targetSubnets: Array<SubnetId>;
  txRootHash: Scalars['String']['output'];
  verifier: Scalars['Int']['output'];
};

export type CertificateId = {
  value: Scalars['String']['input'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  certificate: Certificate;
  /** The endpoint for the GraphQL API, calling our trait implementation on the QueryRoot object */
  certificates: Array<Certificate>;
};


export type QueryRootCertificateArgs = {
  certificateId: CertificateId;
};


export type QueryRootCertificatesArgs = {
  first: Scalars['Int']['input'];
  fromSourceCheckpoint: SourceCheckpoint;
};

export type SourceCheckpoint = {
  positions: Array<SourceStreamPosition>;
  sourceSubnetIds: Array<SubnetIdInput>;
};

export type SourceStreamPosition = {
  certificateId?: InputMaybe<CertificateId>;
  position: Scalars['Int']['input'];
  sourceSubnetId: SubnetIdInput;
};

export type SubnetId = {
  __typename?: 'SubnetId';
  value: Scalars['String']['output'];
};

export type SubnetIdInput = {
  value: Scalars['String']['input'];
};

export type CertificateQueryVariables = Exact<{
  certificateId: CertificateId;
}>;


export type CertificateQuery = { __typename?: 'QueryRoot', certificate: { __typename?: 'Certificate', prevId: string, id: string, proof: string, signature: string, sourceSubnetId: string, stateRoot: string, receiptsRootHash: string, txRootHash: string, verifier: number, targetSubnets: Array<{ __typename?: 'SubnetId', value: string }> } };

export type CertificatesQueryVariables = Exact<{
  fromSourceCheckpoint: SourceCheckpoint;
  limit: Scalars['Int']['input'];
}>;


export type CertificatesQuery = { __typename?: 'QueryRoot', certificates: Array<{ __typename?: 'Certificate', prevId: string, id: string, proof: string, signature: string, sourceSubnetId: string, stateRoot: string, receiptsRootHash: string, txRootHash: string, verifier: number, targetSubnets: Array<{ __typename?: 'SubnetId', value: string }> }> };


export const CertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Certificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prevId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proof"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"stateRoot"}},{"kind":"Field","name":{"kind":"Name","value":"targetSubnets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"receiptsRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"txRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"verifier"}}]}}]}}]} as unknown as DocumentNode<CertificateQuery, CertificateQueryVariables>;
export const CertificatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Certificates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromSourceCheckpoint"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SourceCheckpoint"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fromSourceCheckpoint"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromSourceCheckpoint"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prevId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"proof"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"stateRoot"}},{"kind":"Field","name":{"kind":"Name","value":"targetSubnets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"receiptsRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"txRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"verifier"}}]}}]}}]} as unknown as DocumentNode<CertificatesQuery, CertificatesQueryVariables>;