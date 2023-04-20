/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type CreatePlaceInput = {
  address: Scalars['String'];
  name: Scalars['String'];
  user: UserIdInput;
};

export type CreateUserInput = {
  nickname: Scalars['String'];
  password: Scalars['String'];
  role: Scalars['String'];
  username: Scalars['String'];
};

export type GetManyInput = {
  /** count or data or all, default = data */
  dataType?: InputMaybe<Scalars['String']>;
  /** {key: "ASC" or "DESC" or "asc" or "desc" or 1 or -1} or {key: {direction: "ASC" or "DESC" or "asc" or "desc", nulls: "first" or "last" or "FIRST" or "LAST"}}} */
  order?: InputMaybe<Scalars['JSON']>;
  pagination?: InputMaybe<IPagination>;
  relations?: InputMaybe<Array<Scalars['String']>>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type GetOneInput = {
  relations?: InputMaybe<Array<Scalars['String']>>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type GetPlaceType = {
  __typename?: 'GetPlaceType';
  count?: Maybe<Scalars['Float']>;
  data?: Maybe<Array<Place>>;
};

export type GetUserType = {
  __typename?: 'GetUserType';
  count?: Maybe<Scalars['Float']>;
  data?: Maybe<Array<User>>;
};

export type IPagination = {
  /** Started from 0 */
  page: Scalars['Int'];
  /** Size of page */
  size: Scalars['Int'];
};

export type JwtWithUser = {
  __typename?: 'JwtWithUser';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createManyPlaces: Array<Place>;
  createManyUsers: Array<User>;
  createPlace: Place;
  createUser: User;
  deleteFiles: Scalars['Boolean'];
  deletePlace: Scalars['JSON'];
  deleteUser: Scalars['JSON'];
  refreshToken: Token;
  signIn: JwtWithUser;
  /** Before you start to sign up, you have to set private key and public key in .env */
  signUp: JwtWithUser;
  updatePlace: Place;
  updateUser: User;
  uploadFile: Scalars['String'];
  uploadFiles: Array<Scalars['String']>;
};


export type MutationCreateManyPlacesArgs = {
  input: Array<CreatePlaceInput>;
};


export type MutationCreateManyUsersArgs = {
  input: Array<CreateUserInput>;
};


export type MutationCreatePlaceArgs = {
  input: CreatePlaceInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteFilesArgs = {
  keys: Array<Scalars['String']>;
};


export type MutationDeletePlaceArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['JWT'];
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdatePlaceArgs = {
  id: Scalars['Float'];
  input: UpdatePlaceInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String'];
  input: UpdateUserInput;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
};


export type MutationUploadFilesArgs = {
  files: Array<Scalars['Upload']>;
};

export type Place = {
  __typename?: 'Place';
  address: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  getAddress: Array<Scalars['String']>;
  getManyPlaces: GetPlaceType;
  getManyUsers: GetUserType;
  getOnePlace: Place;
  getOneUser: User;
  me: User;
};


export type QueryGetManyPlacesArgs = {
  input?: InputMaybe<GetManyInput>;
};


export type QueryGetManyUsersArgs = {
  input?: InputMaybe<GetManyInput>;
};


export type QueryGetOnePlaceArgs = {
  input?: InputMaybe<GetOneInput>;
};


export type QueryGetOneUserArgs = {
  input?: InputMaybe<GetOneInput>;
};

export type SignInInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type SignUpInput = {
  nickname: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  listenForNewPlace: Place;
};

export type Token = {
  __typename?: 'Token';
  /** JWT access token */
  accessToken: Scalars['JWT'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT'];
};

export type UpdatePlaceInput = {
  address?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  nickname?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  nickname: Scalars['String'];
  place?: Maybe<Array<Place>>;
  role: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserIdInput = {
  id: Scalars['String'];
};

export type QueryMeQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryMeQuery = { __typename?: 'Query', me: { __typename?: 'User', nickname: string, role: string } };

export type ListenForNewPlaceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ListenForNewPlaceSubscription = { __typename?: 'Subscription', listenForNewPlace: { __typename?: 'Place', address: string, id: string, name: string, user?: { __typename?: 'User', id: string, nickname: string } | null } };

export type GetManyPlacesQueryVariables = Exact<{
  input?: InputMaybe<GetManyInput>;
}>;


export type GetManyPlacesQuery = { __typename?: 'Query', getManyPlaces: { __typename?: 'GetPlaceType', count?: number | null, data?: Array<{ __typename?: 'Place', id: string, name: string, address: string, user?: { __typename?: 'User', id: string, nickname: string } | null }> | null } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'JwtWithUser', refreshToken: string, accessToken: string } };


export const QueryMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queryMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<QueryMeQuery, QueryMeQueryVariables>;
export const ListenForNewPlaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"listenForNewPlace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listenForNewPlace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}}]}}]}}]}}]} as unknown as DocumentNode<ListenForNewPlaceSubscription, ListenForNewPlaceSubscriptionVariables>;
export const GetManyPlacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetManyPlaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetManyInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getManyPlaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetManyPlacesQuery, GetManyPlacesQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;