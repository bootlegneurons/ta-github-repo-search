import React from 'react';
import { RepositoryResult } from './useRepositories';
import styles from './SearchResults.module.css';

type SearchResultsProps = {
  fetchMore: () => void;
  hasMore: boolean;
  isError: boolean;
  isLoading: boolean;
  items: RepositoryResult[];
};

const SearchResults: React.FC<SearchResultsProps> = ({
  fetchMore,
  hasMore,
  isError,
  isLoading,
  items,
}) => {
  if (isError) {
    return <p>Error fetching repositories</p>;
  }

  if (isLoading && !items.length) {
    return <p>Searching repositories...</p>;
  }

  if (!items.length) {
    return <p>No results to display</p>;
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.wrapper}>
        {items.map(({ id, name, watchers, stargazers }) => (
          <li key={id}>
            <h3>{name}</h3>
            <h4>{id}</h4>
            <p>
              {watchers.totalCount} watchers - {stargazers.totalCount} stars
            </p>
          </li>
        ))}
      </ul>
      {!hasMore && <p>End of results</p>}
      {isLoading && <p>Fetching more results...</p>}
      {hasMore && !isLoading && (
        <button onClick={fetchMore} type="button">
          Load more results
        </button>
      )}
    </div>
  );
};

export default SearchResults;
