import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const archive = mutation({
  args: { id: v.id('documents'), userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
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
    if (args.userId === '' || args.userId === null) {
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
    if (args.userId === '' || args.userId === null) {
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

export const getTrash = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()

    return documents
  },
})

export const restore = mutation({
  args: { id: v.id('documents'), userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== args.userId) {
      throw new Error('Unauthorized')
    }

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', args.userId).eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })

        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    }

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)
      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)

    recursiveRestore(args.id)

    return document
  },
})

export const remove = mutation({
  args: { id: v.id('documents'), userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== args.userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.delete(args.id)

    return document
  },
})

export const getSearch = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  },
})

export const getById = query({
  args: {
    documentId: v.id('documents'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const doc = await ctx.db.get(args.documentId)

    if (!doc) {
      throw new Error('Not Found')
    }

    if (doc.isPublished && !doc.isArchived) {
      return doc
    }

    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    if (doc.userId !== args.userId) {
      throw new Error('not authorised')
    }

    return doc
  },
})

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const { id, userId, ...rest } = args

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    })

    return document
  },
})

export const removeIcon = mutation({
  args: { id: v.id('documents'), userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== args.userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    })

    return document
  },
})

export const removeCoverImage = mutation({
  args: { id: v.id('documents'), userId: v.string() },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId !== args.userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    })

    return document
  },
})

export const getDocumentHierarchy = query({
  args: {
    iniId: v.id('documents'), // The initial document ID you provide
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.userId === '' || args.userId === null) {
      throw new Error('not authenticated')
    }

    const result: {
      icon: any
      id: Id<'documents'>
      title: string
    }[] = []

    const recursiveGetHierarchy = async (documentId: Id<'documents'>) => {
      const doc = await ctx.db.get(documentId)
      if (!doc) {
        throw new Error('Document not found')
      }

      const obj = { id: doc._id, title: doc.title, icon: doc.icon || null }

      result.push(obj)

      if (doc.parentDocument) {
        await recursiveGetHierarchy(doc.parentDocument)
      }
    }

    await recursiveGetHierarchy(args.iniId)

    return result
  },
})
