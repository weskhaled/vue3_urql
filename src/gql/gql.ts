/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "\n  query queryMe {\n    me {\n      nickname\n      role\n    }\n  }": types.QueryMeDocument,
    "\n  subscription listenForNewPlace {\n    listenForNewPlace {\n      address\n      id\n      name\n      user {\n        id\n        nickname\n      }\n    }\n  }": types.ListenForNewPlaceDocument,
    "\nquery GetManyPlaces($input: GetManyInput) {\n  getManyPlaces(input: $input) {\n    count\n    data {\n      id\n      name\n      address\n      user {\n        id\n        nickname\n      }\n    }\n  }\n}": types.GetManyPlacesDocument,
    "\n    mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      refreshToken\n      accessToken\n    }\n  }": types.SignInDocument,
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
export function graphql(source: "\n  query queryMe {\n    me {\n      nickname\n      role\n    }\n  }"): (typeof documents)["\n  query queryMe {\n    me {\n      nickname\n      role\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription listenForNewPlace {\n    listenForNewPlace {\n      address\n      id\n      name\n      user {\n        id\n        nickname\n      }\n    }\n  }"): (typeof documents)["\n  subscription listenForNewPlace {\n    listenForNewPlace {\n      address\n      id\n      name\n      user {\n        id\n        nickname\n      }\n    }\n  }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetManyPlaces($input: GetManyInput) {\n  getManyPlaces(input: $input) {\n    count\n    data {\n      id\n      name\n      address\n      user {\n        id\n        nickname\n      }\n    }\n  }\n}"): (typeof documents)["\nquery GetManyPlaces($input: GetManyInput) {\n  getManyPlaces(input: $input) {\n    count\n    data {\n      id\n      name\n      address\n      user {\n        id\n        nickname\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      refreshToken\n      accessToken\n    }\n  }"): (typeof documents)["\n    mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      refreshToken\n      accessToken\n    }\n  }"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;