import React from "react";
import { gql } from "apollo-boost";
import { graphql } from "@apollo/react-hoc";

const getBooksQuery = gql`
  {
    books {
      name
      id
    }
  }
`;

function BookList(props) {
  const displayBooks = () => {
    const data = props.data;
    if (data.loading) {
      return <div>Loading books...</div>;
    } else {
      return data.books.map(book => {
        return (
          <li key={book.id}>{book.name}</li>
        );
      });
    }
  };
  return <ul>{displayBooks()}</ul>;
}

export default graphql(getBooksQuery)(BookList);
