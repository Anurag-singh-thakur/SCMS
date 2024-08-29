import React from 'react';
import './Ebook.css'; 

const Ebook = () => {
  const books = [
    {
      id: 1,
      title: "Book Title 1",
      subject: "Mathematics",
      price: "$20",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Mr. Smith",
      status: "Free",
    },
    {
      id: 2,
      title: "Book Title 2",
      subject: "Science",
      price: "$25",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Ms. Johnson",
      status: "Paid",
    },
    {
      id: 3,
      title: "Book Title 3",
      subject: "History",
      price: "$30",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Dr. Brown",
      status: "Free",
    },
    {
      id: 4,
      title: "Book Title 4",
      subject: "Geography",
      price: "$35",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Ms. Green",
      status: "Paid",
    },
    {
      id: 5,
      title: "Book Title 5",
      subject: "Biology",
      price: "$40",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Mr. White",
      status: "Free",
    },
    {
      id: 6,
      title: "Book Title 6",
      subject: "Biology",
      price: "$40",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Mr. White",
      status: "Free",
    },
    {
      id: 7,
      title: "Book Title 7",
      subject: "Biology",
      price: "$40",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Mr. White",
      status: "Free",
    },
    {
      id: 8,
      title: "Book Title 8",
      subject: "Biology",
      price: "$40",
      imageUrl: "https://via.placeholder.com/150",
      teacher: "Mr. White",
      status: "Free",
    }
  ];

  return (
    <div className="ebook-container">
      <header className="ebook-header">
        <input type="text" className="search-bar" placeholder="Search for an eBook..." />
      </header>
      <main className="ebook-content">
        {books.map((book) => {
        //   console.log(book); 
          return (
            <div key={book.id} className="book-card">
              <img src={book.imageUrl} alt={book.title} className="book-image" />
              <div className="book-details">
                <h1 className="book-name">{book.title}</h1>
                <p className="book-subject">Subject: {book.subject}</p>
                <p className="book-price">Price: {book.price}</p>
                <p className="book-teacher">by {book.teacher}</p>
                <p className="book-status">{book.status}</p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Ebook;
