const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_LOCALHOST, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('connected to mongodb'))

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening for requests on port ${port}`)
})