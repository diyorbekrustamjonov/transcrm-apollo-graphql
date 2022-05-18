import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import "#config/index";
import context from '#utils/context';
import schema from '#modules/index';
import express from 'express';
import { join } from 'path';
import cors from 'cors'
import http from 'http';



!async function() {

  const app = express();

  app.use(express.static(join(process.cwd(), 'assets')))
  
  app.use(cors())
  
  
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context,
    csrfPrevention: true,
    introspection: true,
    plugins: [ 
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    playground: true,

  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}();