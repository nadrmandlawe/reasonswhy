import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    isAdmin: v.boolean(),
    tokenIdentifier: v.string(),
  })
  .index("by_token", ["tokenIdentifier"]),
  
  reasons: defineTable({
    initialName: v.string(),
    tags: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    reasonText: v.string(),
    createdAt: v.number(),
  })
  .searchIndex("search_by_text", {
    searchField: "reasonText",
    filterFields: ["tags", "location"]
  })
  .searchIndex("search_by_location", {
    searchField: "location",
    filterFields: ["tags"]
  }),
  
  flaggedReasons: defineTable({
    reasonId: v.id("reasons"),
    report: v.string(),
    flaggedAt: v.number(),
    status: v.optional(v.string()), // "pending", "reviewed", "removed"
  })
  .index("by_reason", ["reasonId"])
  .index("by_status", ["status"]),
}); 