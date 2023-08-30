import { Strapi } from "@strapi/strapi";

export const resolvers = ({ strapi, nexus }: { strapi: Strapi, nexus }) => {
  const { transformArgs, getContextTypeArgs } = strapi
    .plugin("graphql")
    .service("builders").utils;
  return {
    Query: {
      address: {
        resolve: async (parent, args, context) => {
          const { id, status, limit } = args.input;
          const { toEntityResponse } = strapi.service(
            "plugin::graphql.format"
          ).returnTypes;
          try {
            const data = await strapi.services["api::category.category"].find({
              filters: { slug: "thai-food" },
            });

            const response = toEntityResponse(data.results[0]);
            console.log({ response });
          } catch (e) {
            console.error(e);
          }

          return { id, status, limit };
        },
      },
      orders: {
        // type: "OrderEntityResponseCollection",
        // args: { filters: "OrderFiltersInput", pagination: "PaginationArg" },
        resolve: async (parent, args, ctx) => {
          const { toEntityResponseCollection } = strapi.service(
            "plugin::graphql.format"
          ).returnTypes;
          const userId: string = ctx?.state?.user?.id;

          if (!userId) {
            throw new Error("Unauthorize");
          }

          const filters = args?.filters || {}
          const page = args?.pagination?.page || 1
          const pageSize = args?.pagination?.pageSize || 10
          try {
            const start = (page - 1) * pageSize;
            const limit = pageSize;
            const { results, pagination } = await strapi.services["api::order.order"].find({
              populate: ["order_info", "merchant"],
              filters: {
                ...filters,
                user_id: userId,
                start,
                limit,
              },
            });
            const response = toEntityResponseCollection(results, {
              args: { start, limit, filters: { ...filters, user_id: userId } },
              resourceUID: 'api::order.order'
            })
            console.log(response)
            return response;
          } catch (e) {
            console.error(e);
          }
        },
      },
    },
  };
};
