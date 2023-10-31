import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const archive = mutation({
  args: { id: v.id('documents'), userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '') {
      throw new Error('not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== args.userId) {
      throw new Error('Unauthorized')
    }

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', args.userId).eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        })

        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    recursiveArchive(args.id)

    return document
  },
})

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
