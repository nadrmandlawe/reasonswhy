import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { z } from "zod";
import { QueryCtx, MutationCtx } from "./_generated/server";

async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
    .first();
}

// List all reasons
export const listReasons = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    tags: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    let reasonsQuery = ctx.db.query("reasons").order("desc");

    // Apply tags filter if provided
    if (args.tags && args.tags.length > 0) {
      // First get all reasons and filter in memory
      const allReasons = await reasonsQuery.collect();
      const filteredReasons = allReasons.filter(reason => 
        reason.tags?.some(tag => args.tags!.includes(tag))
      );
      
      // Then paginate the filtered results
      return {
        page: filteredReasons.slice(
          args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0,
          (args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0) + args.paginationOpts.numItems
        ),
        isDone: (args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0) + args.paginationOpts.numItems >= filteredReasons.length,
        continueCursor: ((args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0) + args.paginationOpts.numItems).toString()
      };
    }

    return await reasonsQuery.paginate(args.paginationOpts);
  },
});

// Search reasons
export const searchReasons = query({
  args: { 
    searchQuery: v.string(),
    tags: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    const { searchQuery, tags } = args;
    if (!searchQuery.trim() && (!tags || tags.length === 0)) {
      return [];
    }

    let query = ctx.db.query("reasons");

    // Search in reasonText first
    if (searchQuery.trim()) {
      const textResults = await query
        .withSearchIndex("search_by_text", (q) => q.search("reasonText", searchQuery))
        .collect();

      // If we have results from text search and tag filter is present
      if (textResults.length > 0 && tags && tags.length > 0) {
        return textResults.filter(reason => 
          tags.every(tag => reason.tags?.includes(tag.toLowerCase()))
        );
      }

      // If we have results from text search and no tag filter
      if (textResults.length > 0) {
        return textResults;
      }
    }

    // If we're here, either there were no text results or no search query
    const allReasons = await query.collect();
    
    // Apply tag filters if present
    let filteredReasons = tags && tags.length > 0
      ? allReasons.filter(reason => 
          tags.every(tag => reason.tags?.includes(tag.toLowerCase()))
        )
      : allReasons;

    // If we have a search query, filter by tags containing the search query
    if (searchQuery.trim()) {
      filteredReasons = filteredReasons.filter(reason =>
        reason.tags?.some(t => 
          t === searchQuery.toLowerCase() ||
          t.includes(searchQuery.toLowerCase())
        )
      );

      if (filteredReasons.length > 0) {
        return filteredReasons;
      }

      // Finally, try searching in locations
      const locationResults = await ctx.db
        .query("reasons")
        .withSearchIndex("search_by_location", (q) => q.search("location", searchQuery))
        .collect();

      // Apply tag filters to location results if present
      return tags && tags.length > 0
        ? locationResults.filter(reason => 
            tags.every(tag => reason.tags?.includes(tag.toLowerCase()))
          )
        : locationResults;
    }

    return filteredReasons;
  },
});

// Get a random reason
export const getRandomReason = query({
  args: { timestamp: v.number() },
  handler: async (ctx, args) => {
    const reasons = await ctx.db.query("reasons").collect();
    if (reasons.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * reasons.length);
    return reasons[randomIndex];
  },
});

// Create a new reason
export const createReason = mutation({
  args: {
    initialName: v.string(),
    tags: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    reasonText: v.string(),
  },
  handler: async (ctx, args) => {
    // Process tags: split by commas and clean up
    const tags = args.tags?.map(tag => 
      tag.trim().toLowerCase().replace(/^#/, '')
    ).filter(Boolean) || [];

    const reasonId = await ctx.db.insert("reasons", {
      ...args,
      tags,
      createdAt: Date.now(),
    });
    return reasonId;
  },
});

export const getCount = query({
  handler: async (ctx) => {
    const reasons = await ctx.db.query("reasons").collect();
    return reasons.length;
  },
});

// Get a single reason by ID
export const getReason = query({
  args: { id: v.id("reasons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

const flagReportSchema = z.object({
  report: z.string()
    .min(1, "Please provide a reason for flagging")
    .max(1000, "Report must be less than 1000 characters")
    .trim(),
});

export const flagReason = mutation({
  args: {
    reasonId: v.id("reasons"),
    report: v.string(),
  },
  handler: async (ctx, args) => {
    const { reasonId, report } = args;

    // Validate the report
    try {
      flagReportSchema.parse({ report });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }

    // Check if reason exists
    const reason = await ctx.db.get(reasonId);
    if (!reason) {
      throw new Error("Reason not found");
    }

    // Create flag entry
    await ctx.db.insert("flaggedReasons", {
      reasonId,
      report,
      flaggedAt: Date.now(),
      status: "pending",
    });

    return true;
  },
});

export const listFlaggedReasons = query({
  handler: async (ctx) => {
    const flaggedReasons = await ctx.db
      .query("flaggedReasons")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();

    // Fetch the associated reasons
    const reasonsWithFlags = await Promise.all(
      flaggedReasons.map(async (flag) => {
        const reason = await ctx.db.get(flag.reasonId);
        return {
          ...flag,
          reason,
        };
      })
    );

    return reasonsWithFlags;
  },
});

export const removeReason = mutation({
  args: { 
    reasonId: v.id("reasons"),
  },
  handler: async (ctx, args) => {
    const { reasonId } = args;

    // First, get all associated flags
    const flags = await ctx.db
      .query("flaggedReasons")
      .filter((q) => q.eq(q.field("reasonId"), reasonId))
      .collect();

    // Delete all associated flags
    for (const flag of flags) {
      await ctx.db.delete(flag._id);
    }

    // Delete the reason from the reasons table
    await ctx.db.delete(reasonId);

    return true;
  },
});

export const dismissFlag = mutation({
  args: { 
    flagId: v.id("flaggedReasons"),
  },
  handler: async (ctx, args) => {
    const { flagId } = args;
    
    // Delete the flag instead of updating its status
    await ctx.db.delete(flagId);
    return true;
  },
}); 
