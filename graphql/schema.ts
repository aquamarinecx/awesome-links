import { makeSchema } from "nexus";
import { join } from "path";
import * as types from './types';

export const schema = makeSchema({
    types,
    outputs: {
        typegen: join(process.cwd(), 'node_modules', '@types', 'nexus-typegen', 'index.d.ts'), // This is where your types for your Posts/Users will be written to!
        schema: join(process.cwd(), 'graphql', 'schema.graphql'),
    },
    contextType: {
        export: 'Context',
        module: join(process.cwd(), 'graphql', 'context.ts') // Remember the context is the Prisma instance that we instantiated in context.ts!
    }
})