import express from 'express';
import { graphqlHTTP } from 'express-graphql'; 
import schema from './schema';

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

console.log('Started server: http://localhost:8001/graphql/');

app.listen(8001);
