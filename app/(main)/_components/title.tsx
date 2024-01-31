"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useState,useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

interface TitleProps {
    initialData: Doc<"documents">;
}

export const Title = ({
    initialData
}: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const update = useMutation(api.documents.update);

    const [title, setTitle] = useState(initialData.title);
    const [isEditing, setIsEditing] = useState(false);

    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(()=>{ // 定时器循环时间定为0，是为了让这个函数在下一个事件循环中执行，这样就可以保证input已经被渲染出来了
            inputRef.current?.focus(); // 这一步是为了让input获得焦点
            inputRef.current?.setSelectionRange(0,initialData.title.length); // 这一步是为了让input的文字被选中
        },0);
    }

    const disableInput = () => {
        setIsEditing(false);
    }

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        update({
            id: initialData._id,
            title: event.target.value || "Untitled"
        })
    }

    const onKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            disableInput();
        }
    }

    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.title && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent overflow-hidden dark:text-gray-300"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate font-semibold dark:text-gray-300">
                        {initialData?.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-6 w-20 rounded-md" />
    )
}