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
  positions: CertificatePositions;
  prevId: Scalars['String']['output'];
  proof: Scalars['String']['output'];
  receiptsRootHash: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  sourceSubnetId: Scalars['String']['output'];
  stateRoot: Scalars['String']['output'];
  targetSubnets: Array<Scalars['String']['output']>;
  txRootHash: Scalars['String']['output'];
  verifier: Scalars['Int']['output'];
};

export type CertificatePositions = {
  __typename?: 'CertificatePositions';
  source: SourceStreamPosition;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  certificate: Certificate;
  /** The endpoint for the GraphQL API, calling our trait implementation on the QueryRoot object */
  certificates: Array<Certificate>;
};


export type QueryRootCertificateArgs = {
  certificateId: Scalars['String']['input'];
};


export type QueryRootCertificatesArgs = {
  first: Scalars['Int']['input'];
  fromSourceCheckpoint: SourceCheckpointInput;
};

export type SourceCheckpointInput = {
  positions: Array<SourceStreamPositionInput>;
  sourceSubnetIds: Array<Scalars['String']['input']>;
};

export type SourceStreamPosition = {
  __typename?: 'SourceStreamPosition';
  position: Scalars['Int']['output'];
  sourceSubnetId: Scalars['String']['output'];
};

export type SourceStreamPositionInput = {
  certificateId?: InputMaybe<Scalars['String']['input']>;
  position: Scalars['Int']['input'];
  sourceSubnetId: Scalars['String']['input'];
};

export type SubnetFilter = {
  source?: InputMaybe<Scalars['String']['input']>;
  target?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  /**
   * This endpoint is used to received delivered certificates.
   * It uses a transient stream, which is a stream that is only valid for the current connection.
   *
   * Closing the connection will close the stream.
   * Starting a new connection will start a new stream and the client will not receive
   * any certificates that were delivered before the connection was started.
   */
  watchDeliveredCertificates: Certificate;
};


export type SubscriptionRootWatchDeliveredCertificatesArgs = {
  filter?: InputMaybe<SubnetFilter>;
};

export type CertificateQueryVariables = Exact<{
  certificateId: Scalars['String']['input'];
}>;


export type CertificateQuery = { __typename?: 'QueryRoot', certificate: { __typename?: 'Certificate', prevId: string, id: string, proof: string, signature: string, sourceSubnetId: string, stateRoot: string, targetSubnets: Array<string>, receiptsRootHash: string, txRootHash: string, verifier: number, positions: { __typename?: 'CertificatePositions', source: { __typename?: 'SourceStreamPosition', sourceSubnetId: string, position: number } } } };

export type CertificatesQueryVariables = Exact<{
  fromSourceCheckpoint: SourceCheckpointInput;
  limit: Scalars['Int']['input'];
}>;


export type CertificatesQuery = { __typename?: 'QueryRoot', certificates: Array<{ __typename?: 'Certificate', prevId: string, id: string, proof: string, signature: string, sourceSubnetId: string, stateRoot: string, targetSubnets: Array<string>, receiptsRootHash: string, txRootHash: string, verifier: number, positions: { __typename?: 'CertificatePositions', source: { __typename?: 'SourceStreamPosition', position: number, sourceSubnetId: string } } }> };

export type OnCertificatesSubscriptionVariables = Exact<{
  filter?: InputMaybe<SubnetFilter>;
}>;


export type OnCertificatesSubscription = { __typename?: 'SubscriptionRoot', watchDeliveredCertificates: { __typename?: 'Certificate', prevId: string, id: string, proof: string, signature: string, sourceSubnetId: string, stateRoot: string, targetSubnets: Array<string>, receiptsRootHash: string, txRootHash: string, verifier: number, positions: { __typename?: 'CertificatePositions', source: { __typename?: 'SourceStreamPosition', sourceSubnetId: string, position: number } } } };


export const CertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Certificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prevId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"stateRoot"}},{"kind":"Field","name":{"kind":"Name","value":"targetSubnets"}},{"kind":"Field","name":{"kind":"Name","value":"receiptsRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"txRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"verifier"}}]}}]}}]} as unknown as DocumentNode<CertificateQuery, CertificateQueryVariables>;
export const CertificatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Certificates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromSourceCheckpoint"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SourceCheckpointInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fromSourceCheckpoint"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromSourceCheckpoint"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prevId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"stateRoot"}},{"kind":"Field","name":{"kind":"Name","value":"targetSubnets"}},{"kind":"Field","name":{"kind":"Name","value":"receiptsRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"txRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"verifier"}}]}}]}}]} as unknown as DocumentNode<CertificatesQuery, CertificatesQueryVariables>;
export const OnCertificatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnCertificates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SubnetFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"watchDeliveredCertificates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prevId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"proof"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSubnetId"}},{"kind":"Field","name":{"kind":"Name","value":"stateRoot"}},{"kind":"Field","name":{"kind":"Name","value":"targetSubnets"}},{"kind":"Field","name":{"kind":"Name","value":"receiptsRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"txRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"verifier"}}]}}]}}]} as unknown as DocumentNode<OnCertificatesSubscription, OnCertificatesSubscriptionVariables>;