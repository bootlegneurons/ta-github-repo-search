import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

type SearchInputProps = {
  onChange?: (v: string) => void;
  resultsPath: string;
  value: string;
};

const SearchInput: React.FC<SearchInputProps> = ({ onChange, resultsPath, value }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <form>
      <label htmlFor="searchInput">
        <p>Search:</p>
        <input id="searchInput" onChange={handleChange} type="text" value={value} />
      </label>
      <Link to={`${resultsPath}?q=${value}`}>
        <button type="submit">Search</button>
      </Link>
    </form>
  );
};

export default SearchInput;
