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

export type Image = {
  __typename?: 'Image';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  post: Post;
  updatedAt: Scalars['DateTime'];
  url: UrlSet;
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
  follow: User;
  likeOrDislikePost: Post;
  login: User;
  logout: Scalars['Boolean'];
  register: User;
  unFollow: User;
  updatePost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  aspectRatio: Scalars['String'];
  description: Scalars['String'];
  images: Array<Scalars['String']>;
};


export type MutationDeletePostArgs = {
  id: Scalars['String'];
};


export type MutationFollowArgs = {
  userId: Scalars['String'];
};


export type MutationLikeOrDislikePostArgs = {
  like: Scalars['Boolean'];
  post: Scalars['String'];
};


export type MutationLoginArgs = {
  credentials: Credentials;
};


export type MutationRegisterArgs = {
  credentials: Credentials;
};


export type MutationUnFollowArgs = {
  userId: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  aspectRatio: Scalars['String'];
  author: User;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['String'];
  images: Array<Image>;
  likeCount: Scalars['Float'];
  likedByMe: Scalars['Boolean'];
  likes: Array<Like>;
  updatedAt: Scalars['DateTime'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  list: Array<Post>;
  pageInfo: PostPageInfo;
};

export type PostPageInfo = {
  __typename?: 'PostPageInfo';
  cursor?: Maybe<Scalars['ID']>;
  hasNextPage: Scalars['Boolean'];
};

export enum PostSort {
  CreatedAt = 'createdAt',
  Id = 'id',
  LikeCount = 'likeCount',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  isUsernameAvailable: Scalars['Boolean'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PostConnection;
  signedUrl: Scalars['String'];
  signedUrls: Array<Scalars['String']>;
  /** User public info */
  user: User;
};


export type QueryIsUsernameAvailableArgs = {
  username: Scalars['String'];
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  limit?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortDir>;
  sort?: InputMaybe<PostSort>;
};


export type QuerySignedUrlArgs = {
  filename: Scalars['String'];
};


export type QuerySignedUrlsArgs = {
  filenames: Array<Scalars['String']>;
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

/** Order of sorting */
export enum SortDir {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type UrlSet = {
  __typename?: 'UrlSet';
  large: Scalars['String'];
  medium: Scalars['String'];
  original: Scalars['String'];
  small: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  followers: Array<User>;
  following: Array<User>;
  id: Scalars['String'];
  posts: PostConnection;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};


export type UserPostsArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  limit?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SortDir>;
  sort?: InputMaybe<Scalars['String']>;
};

export type LikesFragment = { __typename?: 'Post', id: string, likedByMe: boolean, likeCount: number };

export type BasicPostFragmentFragment = { __typename?: 'Post', id: string, createdAt: any, updatedAt: any, description: string, aspectRatio: string, likedByMe: boolean, likeCount: number, images: Array<{ __typename?: 'Image', id: string, url: { __typename?: 'UrlSet', original: string, small: string } }>, author: { __typename?: 'User', id: string, username: string } };

export type UserFragmentFragment = { __typename?: 'User', username: string, id: string };

export type CreatePostMutationVariables = Exact<{
  description: Scalars['String'];
  images: Array<Scalars['String']> | Scalars['String'];
  aspectRatio: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: string, createdAt: any, updatedAt: any, description: string, aspectRatio: string, likedByMe: boolean, likeCount: number, images: Array<{ __typename?: 'Image', id: string, url: { __typename?: 'UrlSet', original: string, small: string } }>, author: { __typename?: 'User', id: string, username: string } } };

export type LikeOrDislikePostMutationVariables = Exact<{
  post: Scalars['String'];
  like: Scalars['Boolean'];
}>;


export type LikeOrDislikePostMutation = { __typename?: 'Mutation', likeOrDislikePost: { __typename?: 'Post', id: string, likedByMe: boolean, likeCount: number } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', username: string, id: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', username: string, id: string } };

export type IsUsernameAvailableQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type IsUsernameAvailableQuery = { __typename?: 'Query', isUsernameAvailable: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', username: string, id: string } | null };

export type PostsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  cursor?: InputMaybe<Scalars['ID']>;
  sort?: InputMaybe<PostSort>;
  order?: InputMaybe<SortDir>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostConnection', list: Array<{ __typename?: 'Post', id: string, createdAt: any, updatedAt: any, description: string, aspectRatio: string, likedByMe: boolean, likeCount: number, images: Array<{ __typename?: 'Image', id: string, url: { __typename?: 'UrlSet', original: string, small: string } }>, author: { __typename?: 'User', id: string, username: string } }>, pageInfo: { __typename?: 'PostPageInfo', cursor?: string | null, hasNextPage: boolean } } };

export type SignedUrlQueryVariables = Exact<{
  filename: Scalars['String'];
}>;


export type SignedUrlQuery = { __typename?: 'Query', signedUrl: string };

export type SignedUrlsQueryVariables = Exact<{
  filenames: Array<Scalars['String']> | Scalars['String'];
}>;


export type SignedUrlsQuery = { __typename?: 'Query', signedUrls: Array<string> };

export const LikesFragmentDoc = gql`
    fragment Likes on Post {
  id
  likedByMe
  likeCount
}
    `;
export const BasicPostFragmentFragmentDoc = gql`
    fragment BasicPostFragment on Post {
  id
  createdAt
  updatedAt
  description
  aspectRatio
  likedByMe
  likeCount
  images {
    id
    url {
      original
      small
    }
  }
  author {
    id
    username
  }
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  username
  id
}
    `;
export const CreatePostDocument = gql`
    mutation CreatePost($description: String!, $images: [String!]!, $aspectRatio: String!) {
  createPost(
    description: $description
    images: $images
    aspectRatio: $aspectRatio
  ) {
    ...BasicPostFragment
  }
}
    ${BasicPostFragmentFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      description: // value for 'description'
 *      images: // value for 'images'
 *      aspectRatio: // value for 'aspectRatio'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const LikeOrDislikePostDocument = gql`
    mutation LikeOrDislikePost($post: String!, $like: Boolean!) {
  likeOrDislikePost(post: $post, like: $like) {
    ...Likes
  }
}
    ${LikesFragmentDoc}`;
export type LikeOrDislikePostMutationFn = Apollo.MutationFunction<LikeOrDislikePostMutation, LikeOrDislikePostMutationVariables>;

/**
 * __useLikeOrDislikePostMutation__
 *
 * To run a mutation, you first call `useLikeOrDislikePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeOrDislikePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeOrDislikePostMutation, { data, loading, error }] = useLikeOrDislikePostMutation({
 *   variables: {
 *      post: // value for 'post'
 *      like: // value for 'like'
 *   },
 * });
 */
export function useLikeOrDislikePostMutation(baseOptions?: Apollo.MutationHookOptions<LikeOrDislikePostMutation, LikeOrDislikePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeOrDislikePostMutation, LikeOrDislikePostMutationVariables>(LikeOrDislikePostDocument, options);
      }
export type LikeOrDislikePostMutationHookResult = ReturnType<typeof useLikeOrDislikePostMutation>;
export type LikeOrDislikePostMutationResult = Apollo.MutationResult<LikeOrDislikePostMutation>;
export type LikeOrDislikePostMutationOptions = Apollo.BaseMutationOptions<LikeOrDislikePostMutation, LikeOrDislikePostMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(credentials: {username: $username, password: $password}) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(credentials: {username: $username, password: $password}) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
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
export const IsUsernameAvailableDocument = gql`
    query IsUsernameAvailable($username: String!) {
  isUsernameAvailable(username: $username)
}
    `;

/**
 * __useIsUsernameAvailableQuery__
 *
 * To run a query within a React component, call `useIsUsernameAvailableQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsUsernameAvailableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsUsernameAvailableQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useIsUsernameAvailableQuery(baseOptions: Apollo.QueryHookOptions<IsUsernameAvailableQuery, IsUsernameAvailableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsUsernameAvailableQuery, IsUsernameAvailableQueryVariables>(IsUsernameAvailableDocument, options);
      }
export function useIsUsernameAvailableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsUsernameAvailableQuery, IsUsernameAvailableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsUsernameAvailableQuery, IsUsernameAvailableQueryVariables>(IsUsernameAvailableDocument, options);
        }
export type IsUsernameAvailableQueryHookResult = ReturnType<typeof useIsUsernameAvailableQuery>;
export type IsUsernameAvailableLazyQueryHookResult = ReturnType<typeof useIsUsernameAvailableLazyQuery>;
export type IsUsernameAvailableQueryResult = Apollo.QueryResult<IsUsernameAvailableQuery, IsUsernameAvailableQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostsDocument = gql`
    query Posts($limit: Int, $cursor: ID, $sort: PostSort, $order: SortDir) {
  posts(limit: $limit, cursor: $cursor, sort: $sort, order: $order) {
    list {
      ...BasicPostFragment
    }
    pageInfo {
      cursor
      hasNextPage
    }
  }
}
    ${BasicPostFragmentFragmentDoc}`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      sort: // value for 'sort'
 *      order: // value for 'order'
 *   },
 * });
 */
export function usePostsQuery(baseOptions?: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const SignedUrlDocument = gql`
    query SignedUrl($filename: String!) {
  signedUrl(filename: $filename)
}
    `;

/**
 * __useSignedUrlQuery__
 *
 * To run a query within a React component, call `useSignedUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignedUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignedUrlQuery({
 *   variables: {
 *      filename: // value for 'filename'
 *   },
 * });
 */
export function useSignedUrlQuery(baseOptions: Apollo.QueryHookOptions<SignedUrlQuery, SignedUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignedUrlQuery, SignedUrlQueryVariables>(SignedUrlDocument, options);
      }
export function useSignedUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignedUrlQuery, SignedUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignedUrlQuery, SignedUrlQueryVariables>(SignedUrlDocument, options);
        }
export type SignedUrlQueryHookResult = ReturnType<typeof useSignedUrlQuery>;
export type SignedUrlLazyQueryHookResult = ReturnType<typeof useSignedUrlLazyQuery>;
export type SignedUrlQueryResult = Apollo.QueryResult<SignedUrlQuery, SignedUrlQueryVariables>;
export const SignedUrlsDocument = gql`
    query SignedUrls($filenames: [String!]!) {
  signedUrls(filenames: $filenames)
}
    `;

/**
 * __useSignedUrlsQuery__
 *
 * To run a query within a React component, call `useSignedUrlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignedUrlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignedUrlsQuery({
 *   variables: {
 *      filenames: // value for 'filenames'
 *   },
 * });
 */
export function useSignedUrlsQuery(baseOptions: Apollo.QueryHookOptions<SignedUrlsQuery, SignedUrlsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignedUrlsQuery, SignedUrlsQueryVariables>(SignedUrlsDocument, options);
      }
export function useSignedUrlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignedUrlsQuery, SignedUrlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignedUrlsQuery, SignedUrlsQueryVariables>(SignedUrlsDocument, options);
        }
export type SignedUrlsQueryHookResult = ReturnType<typeof useSignedUrlsQuery>;
export type SignedUrlsLazyQueryHookResult = ReturnType<typeof useSignedUrlsLazyQuery>;
export type SignedUrlsQueryResult = Apollo.QueryResult<SignedUrlsQuery, SignedUrlsQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    