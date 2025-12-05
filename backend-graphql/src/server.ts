import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    const { url } = await server.listen({ port: 4000 });
    console.log(`🚀 GraphQL Server running at ${url}`);
    console.log(`📍 GraphQL Playground: ${url}graphql`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
