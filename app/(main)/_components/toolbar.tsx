"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean // preview指的是是否在预览模式下
}

export const Toolbar = ({
    initialData,
    preview
}:ToolbarProps) => {

    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing,setEditing] = useState(false);
    const [value, setValue] = useState(initialData.title);

    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);

    const enableInput = () => {
        if(preview) return;
        setEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const disableInput = () => {
        setEditing(false);
    };

    const onInput = (value:string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled"
        });
    };

    const onKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput();
        };
    };

    const onIconSelect = (icon:string) => {
        update({
            id: initialData._id,
            icon,
        });
    };

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id
        })
    }

    return (
        <div className="pl-[54px] group relative">
            {/* 如果没有图标，就显示一个按钮 */}
            { !!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        onClick={onRemoveIcon}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                        variant="outline"
                        size="icon"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            {/* 如果有图标，就显示图标 */}
            { !!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}
            <div className="opacity-0 flex items-center gap-x-1 py-4 group-hover:opacity-100">
                { !initialData.icon && !preview && (
                    <IconPicker onChange={onIconSelect} asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-muted-foreground text-xs"
                        >
                            <Smile className="w-4 h-4 mr-2"/>
                            Add icon
                        </Button>
                    </IconPicker>
                )}
                { !initialData.coverImage && !preview && (
                    <Button
                        onClick={()=>{} }
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="h-4 w-4 mr-2"/>
                        Add hover
                    </Button>
                )}
            </div>
            { isEditing && !preview ? (
                <TextareaAutosize 
                    ref={inputRef}
                    value={value}
                    onChange={(event)=>onInput(event.target.value) }
                    onKeyDown={onKeyDown}
                    onBlur={disableInput}
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl font-bold break-words outline-none"
                >
                    {initialData.title}
                </div>
            )}
        </div>
    )
}