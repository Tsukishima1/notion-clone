"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";

import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";

export const SearchCommand = () => {
    const { user } = useUser();
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);
    const [isMounted, setIsMounted] = useState(false);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);

    useEffect(() => { // 用于监听路由变化，如果路由变化，就关闭搜索框
        setIsMounted(true);
        // 这一步是为了避免在SSR时，useSearch会报错，因为SSR时，useSearch会被调用两次，第一次是在服务端，第二次是在客户端
        // SSR是服务端渲染，客户端渲染是CSR
    }, []);

    useEffect(() => { // 用于监听键盘事件，如果按下ctrl+k，就打开搜索框
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
        }

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [toggle]); // 数组里的值发生变化时，就会重新执行useEffect里的函数

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    };

    if (!isMounted) {
        return null; // 如果没有挂载，就返回null
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />
            <CommandList>
                <CommandEmpty>No results</CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents?.map((document) => (
                        <CommandItem
                            key={document._id}
                            value={`${document._id}-${document.title}`}
                            title={document.title}
                            onSelect={onSelect}
                        >
                            {document.icon ? (
                                <p className="mr-2 text-[18px]">
                                    {document.icon}
                                </p>
                            ) : (
                                <File className="mr-2 h-4 w-4" />
                            )}
                            <span>
                                {document.title}
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}