import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import useRepositories from './useRepositories';

const Repositories: React.FC = () => {
  const { search: queryString } = useLocation();
  const queryParams = new URLSearchParams(queryString);
  const search = queryParams.get('q') || '';
  const [searchInput, setSearchInput] = useState<string>(search);

  const { items, error, loading, hasMore, fetchMore } = useRepositories({ search });

  return (
    <>
      <h1>Repository Search</h1>
      <SearchInput
        onChange={(value): void => setSearchInput(value)}
        resultsPath="/repositories"
        value={searchInput}
      />
      <h2>Results</h2>
      <SearchResults
        fetchMore={fetchMore}
        hasMore={hasMore}
        isError={!!error}
        isLoading={loading}
        items={items}
      />
    </>
  );
};

export default Repositories;
