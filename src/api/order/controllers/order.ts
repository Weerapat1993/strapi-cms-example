/**
 * order controller
 */

import { factories, Strapi } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }: { strapi: Strapi }) => ({
  async find(ctx) {
    const id = ctx.state?.user?.id
    const { filters }  = ctx.query
    ctx.query = {
      ...ctx.query,
      filters: {
        ...filters,
        user_id: id
      }
    }
    try {
      const { data, meta } = await super.find(ctx);
      return { data, meta };
    } catch (e) {
      console.error(e)
    }
 
  },
  async findOne(ctx) {
    const { user } = ctx.state
    const { id } = ctx.params

    let entity
    let sanitzedEntity
    try {
      entity = await strapi.service('api::order:order').findOne(id, { user: user.id })
      sanitzedEntity = await this.sanitzedOutput(entity, ctx);
    } catch (e) {
      console.error(e)
    }

    return this.transformResponse(sanitzedEntity)
  }
}));
