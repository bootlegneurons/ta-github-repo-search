import React, { useState } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

const Repositories: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');

  return (
    <>
      <h1>Repository Search</h1>
      <SearchInput
        onChange={(value): void => setSearchInput(value)}
        resultsPath="/repositories"
        value={searchInput}
      />
      <h2>Results</h2>
      <SearchResults />
    </>
  );
};

export default Repositories;
