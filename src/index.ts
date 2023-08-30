import type { Strapi } from '@strapi/strapi';
import { resolvers } from './graphql/resolvers'
import { resolversConfig } from './graphql/resolversConfig'
import { typeDefs } from './graphql/typeDefs'

export default {
  register( { strapi }: { strapi: Strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');
    extensionService.use(({ nexus }) => {
      return {
        typeDefs,
        resolvers: resolvers({ strapi, nexus }),
        resolversConfig,
      }
    })
  },

  bootstrap() {},
};