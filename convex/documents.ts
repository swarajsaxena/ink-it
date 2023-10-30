import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const get = query({
  handler: async (ctx) => {
    const documents = await ctx.db.query('document').collect()
    return documents
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.userId === '') {
      throw new Error('not authenticated')
    }

    const document = await ctx.db.insert('document', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId: args.userId,
      isArchived: false,
      isPublished: false,
    })

    return document
  },
})
