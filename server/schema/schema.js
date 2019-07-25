const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book')
const Author = require('../models/author')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "All the fields supported by the BookType",
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "An auto-generated alphanumeric string"
    },
    name: {
      type: GraphQLString,
      description: "Name of Book"
    },
    genre: {
      type: GraphQLString,
      description: "Genre of book, e.g. Sci-Fi, Romance..."
    },
    author: {
      type: AuthorType,
      description: "The author ObjectType",
      resolve(parent, args) {
        // return _.find(authors, {id: parent.authorId})
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "All the fields supported by the AuthorType",
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "An auto-generated alphanumeric string"
    },
    name: {
      type: GraphQLString,
      description: "Name of Author"
    },
    age: {
      type: GraphQLInt,
      description: "Age of Author"
    },
    books: {
      type: new GraphQLList(BookType),
      description: "The book ObjectType",
      resolve(parent, args) {
        // return _.filter(books, {authorId: parent.id})
        return Book.find({ authorId: parent.id });
      }
    }
  })
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "All request to retrieve data from the server",
  fields: {
    book: {
      type: BookType,
      description: "Fetch a book by Id",
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      description: "Fetch an author by Id",
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id })
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      description: "Fetch all books",
      resolve(parent, args) {
        // return books
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "Fetch all authors",
      resolve(parent, args) {
        // return authors
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "All request to create or modify data on the server",
  fields: {
    addAuthor: {
      type: AuthorType,
      description: "Add a new author",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      description: "Add a new book",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})