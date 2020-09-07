import React from "react";
const SearchInput = ({ onSearch, searchQuery, onChange, onSearchClose }) => {
  return (
    <form onSubmit={onSearch}>
      <div className="input-field">
        <input
          id="searchQuery"
          onChange={onChange}
          type="search"
          required
          value={searchQuery}
        />
        <label className="label-icon" htmlFor="search">
          <i className="material-icons">search</i>
        </label>
        <i onClick={onSearchClose} className="material-icons">
          close
        </i>
      </div>
    </form>
  );
};

export default SearchInput;
