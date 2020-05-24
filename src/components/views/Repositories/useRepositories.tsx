import { useEffect, useState, useCallback } from 'react';
import ApolloClient, { gql, ApolloError } from 'apollo-boost';
import getEnvVar from '../../../utils/getEnvVar';

export type RepositoryResult = {
  id: string;
  name: string;
  watchers: { totalCount: number };
  stargazers: { totalCount: number };
};

type UseRepositories = {
  items: RepositoryResult[];
  error: ApolloError | null;
  loading: boolean;
  hasMore: boolean;
  fetchMore: () => void;
};

type UseRepositoriesInput = {
  search: string;
};

type SearchRepositoriesResult = {
  newItems: RepositoryResult[];
  hasNextPage: boolean;
  endCursor: string | null;
};

const GITHUB_GRAPHQL_URI = 'https://api.github.com/graphql';
const RESULTS_PER_PAGE = 25;

const REPOSITORIES_QUERY = gql`
  query($search: String!, $cursor: String) {
    search(first: ${RESULTS_PER_PAGE}, after: $cursor, type: REPOSITORY, query: $search) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Repository {
          id
          name
          watchers {
            totalCount
          }
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`;

// NOTE: using a global ApolloClient instance connecting directly to GitHub's qraphql API.
// This ensures useRepositories is completely self-contained, but pattern won't scale well.
// Pattern should be reconsidered based on complexity of app and business requirements.
const client = new ApolloClient({
  uri: GITHUB_GRAPHQL_URI,
  headers: {
    authorization: `Bearer ${getEnvVar('GITHUB_TOKEN')}`,
  },
});

const searchRepositories = async (
  search: string,
  cursor: string | null = null
): Promise<SearchRepositoriesResult> => {
  const result = await client.query({
    query: REPOSITORIES_QUERY,
    variables: { search: `${search} in:"name" sort:stars-desc`, cursor },
  });

  const {
    data: {
      search: {
        nodes: newItems,
        pageInfo: { hasNextPage, endCursor },
      },
    },
  } = result;

  return { newItems, hasNextPage, endCursor };
};

const useRepositories = ({ search }: UseRepositoriesInput): UseRepositories => {
  const [items, setItems] = useState<RepositoryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApolloError | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);

  // When performing query, concat results to existing items and update pagination vars
  const fetchMore = useCallback(() => {
    const fetch = async (): Promise<void> => {
      setLoading(true);

      try {
        const { newItems, hasNextPage, endCursor } = await searchRepositories(search, cursor);

        setItems(existingItems => existingItems.concat(newItems));
        setHasMore(hasNextPage);
        setCursor(endCursor);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [search, cursor]);

  // Reset items and cursor if search term changes, and set shouldFetch flag if search not null
  useEffect(() => {
    setItems([]);
    setCursor(null);

    if (search) {
      setShouldFetch(true);
    }
  }, [search]);

  // Perform a fetch if required
  useEffect(() => {
    if (shouldFetch) {
      fetchMore();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchMore]);

  return { items, error, loading, hasMore, fetchMore };
};

export default useRepositories;
