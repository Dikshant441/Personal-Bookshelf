import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BookSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true); // Set loading state to true
      if (query.length > 1) {
        try {
          const response = await fetch(
            `https://openlibrary.org/search.json?q=${query}&limit=10&page=1`
          );
          const data = await response.json();
          setBooks(data.docs);
        } catch (error) {
          console.error("Error fetching books:", error);
          // Handle errors gracefully (e.g., display an error message)
        } finally {
          setIsLoading(false); // Set loading state to false after fetch (success or error)
        }
      } else {
        setBooks([]); // Clear books if query length is less than or equal to 1
      }
    };

    fetchBooks(); // Fetch books on initial render and query changes
  }, [query]); // Dependency array to trigger fetch on query change

  const addToBookShelf = (book) => {
    const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    const isBookAlreadyAdded = bookshelf.some(
      (savedBook) => savedBook.key === book.key
    );
    if (!isBookAlreadyAdded) {
      bookshelf.push(book);
      localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
    } else {
      alert("This book is already in your bookshelf!");
    }
  };

  const goToBookShelf = () => {
    navigate("/bookshelf");
  };

  return (
    <div className="booksearch">
      <div className="search">
        <span>Search by book name:</span>
        <input
          type="search"
          className="b-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div class="loading-container">
        <div class="loading">Loading books...
        <span>Note: To view all available books, please enter a search term with book name with random text.</span>
        </div>
      </div>
      ) : (
        <div className="results">
          {books.map((book) => (
            <div key={book.key} className="book-card">
              <h3>{book.title}</h3>
              <button onClick={() => addToBookShelf(book)} className="b-card">
                Add to Bookshelf
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="shelf">
        <input
          type="button"
          value="My Bookshelf"
          className="b-shelf"
          onClick={goToBookShelf}
        />
      </div>
    </div>
  );
}

export default BookSearch;
