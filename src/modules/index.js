import { makeExecutableSchema } from '@graphql-tools/schema'

import types from '#modules/types/index';

import auth from '#modules/auth/index';
import branch from '#modules/branch/index';
import other from '#modules/other/index';
import permission from '#modules/permission/index';
import staff from '#modules/staff/index';
import transport from '#modules/transport/index';


const schema = makeExecutableSchema({
  typeDefs: [
      types.typeDefs,
      auth.typeDefs,
      branch.typeDefs,
      other.typeDefs,
      permission.typeDefs,
      staff.typeDefs,
      transport.typeDefs,
  ],
  resolvers: [
      types.resolvers,
      auth.resolvers,
      branch.resolvers,
      other.resolvers,
      permission.resolvers,
      staff.resolvers,
      transport.resolvers
  ]
});

export default schema;