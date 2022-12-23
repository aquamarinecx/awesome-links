import { link } from "fs";
import { objectType, extendType, intArg, stringArg } from "nexus";
import { User } from './User'

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.string('id')
        t.string('title')
        t.string('url')
        t.string('description')
        t.string('imageUrl')
        t.string('category')
        t.list.field('users', {
            type: User,
            async resolve(_parent, _args, ctx) {
                return await ctx.prisma.link.findUnique({
                    where: {
                        id: _parent.id,
                    },
                })
                .users()
            }
        })
    }
})

export const LinksQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('links', {
      type: Response,
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_, args, ctx) {
        let queryResults = null

        if (args.after) {
          // checks if there is a cursor as the argument
          queryResults = await ctx.prisma.link.findMany({
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after,
            }
          })
        } else {
          // if no cursor, this meas that this is the first request, we will populate client with initial data (Ah, so take is how many Links we want to fetch from the beginning)
          queryResults = await ctx.prisma.link.findMany({
            take: args.first,
          })
        }

        // in the initial request returns links
        if (queryResults.length > 0) {
          // We will set the cursor to the last link that was fetched
          const lastLinkInResults = queryResults[queryResults.length - 1]
          const myCursor = lastLinkInResults.id

          // myCursor will be used as the cursor in subsequent requests

          // query after the cursor to check if we have nextPage (there are still more links that haven't been fetched)
          const secondQueryresults = await ctx.prisma.link.findMany({
            take: args.first,
            cursor: {
              id: myCursor,
            },
            orderBy: {
              id: 'asc',
            },
          })

          // return the response
          const result = {
            pageInfo: {
              endCursor: myCursor,
              hasNextPage: secondQueryresults.length >= args.first,
            },
            edges: queryResults.map(link => ({
              cursor: link.id,
              node: link,
            })),
          }

          return result;
        }

        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          edges: [],
        }
      },
    })
  },
})





// PAGINATION

// Types:

export const Edge = objectType({
  name: 'Edge',
  definition(t) {
    t.string('cursor')
    t.field('node', {
      type: Link,
    })
  },
})

export const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('endCursor')
    t.boolean('hasNextPage')
  },
})

export const Response = objectType({
  name: 'response',
  definition(t) {
    t.field('pageInfo', {type: PageInfo})
    t.list.field('edges', {
      type: Edge,
    })
  }
})