import "./SearchBar.css";

type SearchBarProps = {
    placeholder: string;
};

function SearchBar({
    placeholder,
}: SearchBarProps) {

    return (

        <div className="search-bar">

            <input
                type="text"
                placeholder={placeholder}
            />

        </div>

    );

}

export default SearchBar;