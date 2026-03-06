import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Pesquisar pelo nome..." }) => {
  return (
    <div className="search-input-wrapper">
      <Search size={16} className="search-input-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
