import { defineSchema,defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents:defineTable({
        title: v.string(), // 这里指的是文档标题，类型是字符串
        userId: v.string(), // 这里指的是用户id，类型是字符串
        isArchived: v.boolean(), // 这里指的是是否归档，类型是布尔值
        parentDocument: v.optional(v.id("documents")), // 这里指的是父文档，类型是文档id 
        content: v.optional(v.string()), // 这里指的是文档内容，类型是字符串，可选
        coverImage: v.optional(v.string()), // 这里指的是封面图片，类型是字符串，可选
        icon: v.optional(v.string()), // 这里指的是图标，类型是字符串，可选
        isPublished: v.boolean(), // 这里指的是是否发布，类型是布尔值
    })
    .index("by_user", ["userId"]) // 这里指的是按照用户id建立索引
    .index("by_user_parent", ["userId", "parentDocument"]) // 这里指的是按照用户id和父文档建立索引
})