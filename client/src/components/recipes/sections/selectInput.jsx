import React from "react";
const SelectInput = ({ onCategorySelect, selectedCategory, categories }) => {
  return (
    <div className="input-field col s6 m12">
      <select onChange={onCategorySelect} value={selectedCategory}>
        <option value="">None</option>
        {categories.map((data) => (
          <option key={data._id} value={data._id}>
            {data.type}
          </option>
        ))}
      </select>
      <label>Filter by category</label>
    </div>
  );
};

export default SelectInput;
