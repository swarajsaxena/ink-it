import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.userId === '') {
      throw new Error('not authenticated')
    }
    return await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', args.userId).eq('parentDocument', args.parentDocument)
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()
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

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId: args.userId,
      isArchived: false,
      isPublished: false,
    })

    return document
  },
})
