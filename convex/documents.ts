import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc,Id } from "./_generated/dataModel";

export const archive = mutation({
    args: {id:v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not found");
        }
        if (existingDocument.userId !== userId) { // 这里指的是如果文档的用户id不等于用户id,抛出错误
            throw new Error("Unauthorized");
        }

        const recursiveArchive = async (documentId: Id<"documents">) => { // 这里指的是递归归档
            const children = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q.eq("userId", userId).eq("parentDocument", documentId)
            )
            .collect(); // 这里指的是获取子文档

            for (const child of children) { // 有两个await，所以这里需要用for of循环，而不是forEach，因为forEach不支持async!!
                await ctx.db.patch(child._id, {
                    isArchived: true,
                }); // 这里指的是更新子文档的isArchived属性
                await recursiveArchive(child._id); // 这里指的是递归归档子文档
            }
        }

        const document = await ctx.db.patch(args.id, { // patch指的是更新文档，这里指的是更新文档的isArchived属性
            isArchived: true,
        });

        recursiveArchive(args.id); // 这里指的是递归归档

        return document;
    }
})

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); 
        if (!identity) {
            throw new Error("Unauthorized"); 
        }
        const userId = identity.subject; 
        const documents = await ctx.db 
        .query("documents") // 查询数据库中的documents表
        .withIndex("by_user_parent",(q)=> 
          q
            .eq("userId", userId)
            .eq("parentDocument", args.parentDocument)
        ) // 按照用户id和父文档查询
        .filter((q)=>q.eq(q.field("isArchived"),false)) // 过滤掉已归档的文档
        .order("desc") // 按照降序排列
        .collect(); // 转换为数组

        return documents;
    }
})

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

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity(); // 这里指的是获取用户身份
        if (!identity) {
            throw new Error("Unauthorized"); // 这里指的是如果没有用户身份，抛出错误
        }
        const userId = identity.subject; // 这里指的是获取用户id

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) =>
            q.eq("userId", userId)
        )
        .filter((q) => q.eq(q.field("isArchived"), true))
        .order("desc")
        .collect(); // 这里指的是获取文档

        return documents; // 这里指的是返回文档
    }
});

export const restore = mutation({ // 这里指的是恢复文档
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not found");
        }
        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q.eq("userId", userId).eq("parentDocument", documentId)
            )
            .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });
                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"documents">> = { // Partial是指可以不传入这个参数
            isArchived: false,
        };

        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);
            if (parent?.isArchived) { // 这里指的是如果父文档被归档了，那么就将父文档设置为undefined
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options); // 这里指的是更新文档

        recursiveRestore(args.id); // 这里指的是递归恢复文档

        return document;
    }
});

export const remove = mutation({ // 这里指的是删除文档
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not found");
        }
        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const document = await ctx.db.delete(args.id); // 这里指的是删除文档

        return document;
    }
});

export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const userId = identity.subject;

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) =>
            q.eq("userId", userId)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .order("desc")
        .collect();

        return documents;
    }
})