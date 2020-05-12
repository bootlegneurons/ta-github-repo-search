import { useEffect, useState } from 'react';
import ApolloClient, { gql, ApolloError } from 'apollo-boost';
import getEnvVar from '../../../utils/getEnvVar';

const GITHUB_GRAPHQL_URI = 'https://api.github.com/graphql';

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
};

type UseRepositoriesInput = {
  search: string;
};

const REPOSITORIES_QUERY = gql`
  query($search: String!) {
    search(first: 100, type: REPOSITORY, query: $search) {
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

const useRepositories = ({ search }: UseRepositoriesInput): UseRepositories => {
  const [items, setItems] = useState<RepositoryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApolloError | null>(null);

  useEffect(() => {
    // Do not fetch if no search term is provided
    if (search === '') {
      return;
    }

    const searchRepositories = async (): Promise<void> => {
      setItems([]);
      setError(null);
      setLoading(true);

      try {
        const result = await client.query({
          query: REPOSITORIES_QUERY,
          variables: { search: `${search} in:name sort:stars-desc` },
        });
        setItems(result.data.search.nodes);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    searchRepositories();
  }, [search]);

  return { items, error, loading };
};

export default useRepositories;
