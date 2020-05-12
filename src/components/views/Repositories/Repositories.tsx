import React from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

const Repositories: React.FC = () => (
  <>
    <h1>Repository Search</h1>
    <SearchInput />
    <h2>Results</h2>
    <SearchResults />
  </>
);

export default Repositories;
