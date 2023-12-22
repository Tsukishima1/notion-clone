import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc,Id } from "./_generated/dataModel";

export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity(); // 这里指的是获取用户身份
        if (!identity) {
            throw new Error("Unauthorized"); // 这里指的是如果没有用户身份，抛出错误
        }
        const documents = await ctx.db.query("documents").collect();
        // 这里指的是获取文档。为什么最后要加上collect()呢？因为这里的documents是一个Cursor，而不是一个数组，所以我们需要将其转换为数组。

        return documents; // 这里指的是返回文档
    }
})
export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // 这里指的是获取用户身份
        if (!identity) {
            throw new Error("Unauthorized"); // 这里指的是如果没有用户身份，抛出错误
        }
        const userId = identity.subject; // 这里指的是获取用户id

        const document = await ctx.db.insert("documents", {
            title: args.title,
            userId,
            parentDocument: args.parentDocument,
            isArchived: false,
            isPublished: false,
        }); // 这里指的是创建文档

        return document; // 这里指的是返回文档
    }
})
