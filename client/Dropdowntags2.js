import React, { useState } from "react";
import "./Dropdowntags.css";

const Dropdowntags = ({ onSelect }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5"
  ];

  const handleItemClick = (item) => {
    setSelectedItems(prevSelectedItems => {
      const index = prevSelectedItems.indexOf(item);
      if (index === -1) {
        return [...prevSelectedItems, item];
      } else {
        return prevSelectedItems.filter((_, i) => i !== index);
      }
    });
  };

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

 
  const handleSubmit = (event) => {
    event.preventDefault();
    onSelect(selectedItems);
    setSelectedItems([]);
    setIsDropdownOpen(false);
    const selected = document.querySelectorAll(".selected");
    selected.forEach((item) => item.classList.remove("selected"));
  };
  
  

  return (
    <div className="multi-select-dropdown" style={{display : "flex"}}>
       {/* <span>Tags:</span> */}
      <div className="dropdown-header" onClick={handleDropdownClick}>
       Tags :    
        <button className="btn btn-outline-success my-0 my-sm-0 " onClick={handleSubmit}>Apply</button>
      </div>
      {isDropdownOpen && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="search-input"
          />
          <ul className="option-list">
            {filteredOptions.map((item) => (
              <li
                key={item}
                onClick={() => handleItemClick(item)}
                className={`option-item ${
                  selectedItems.indexOf(item) !== -1 ? "selected" : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
          <button type="submit">Apply</button>
        </form>
      )}
    </div>
  );
};

export default Dropdowntags;
