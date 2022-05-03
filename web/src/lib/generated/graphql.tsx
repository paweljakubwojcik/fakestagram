import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Credentials = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Edge = {
  __typename?: 'Edge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Post>;
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  deletePost: Scalars['Boolean'];
  dislikePost: Scalars['Boolean'];
  likePost: Scalars['Boolean'];
  login: User;
  register: User;
  updatePost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  body: Scalars['String'];
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String'];
};


export type MutationDislikePostArgs = {
  post: Scalars['String'];
};


export type MutationLikePostArgs = {
  post: Scalars['String'];
};


export type MutationLoginArgs = {
  credentials: Credentials;
};


export type MutationRegisterArgs = {
  credentials: Credentials;
};


export type MutationUpdatePostArgs = {
  body?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator: User;
  id: Scalars['String'];
  likeCount: Scalars['Float'];
  likedByMe: Scalars['Boolean'];
  likes: Array<Like>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges?: Maybe<Array<Edge>>;
  pageInfo?: Maybe<PostPageInfo>;
};

export type PostPageInfo = {
  __typename?: 'PostPageInfo';
  endCursor?: Maybe<Scalars['ID']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['ID']>;
};

export enum PostSort {
  CreatedAt = 'createdAt',
  Id = 'id',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  isUsernameAvailable: Scalars['Boolean'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PostConnection;
};


export type QueryIsUsernameAvailableArgs = {
  username: Scalars['String'];
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};


export type QueryPostsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Float']>;
  last?: InputMaybe<Scalars['Float']>;
  sort?: InputMaybe<PostSort>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  posts: Array<Post>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string, username: string } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: string } };


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(credentials: {username: $username, password: $password}) {
    id
    username
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(credentials: {username: $username, password: $password}) {
    id
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    