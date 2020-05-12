import React from 'react';
import { RepositoryResult } from './useRepositories';
import styles from './SearchResults.module.css';

type SearchResultsProps = {
  isError: boolean;
  isLoading: boolean;
  items: RepositoryResult[];
};

const SearchResults: React.FC<SearchResultsProps> = ({ isError, isLoading, items }) => {
  if (isError) {
    return <p>Error fetching repositories</p>;
  }

  if (isLoading) {
    return <p>Searching repositories...</p>;
  }

  if (!items.length) {
    return <p>No results to display</p>;
  }

  return (
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
  );
};

export default SearchResults;
