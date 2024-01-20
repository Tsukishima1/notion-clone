"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings, Plus, Trash } from 'lucide-react';
import {
    Popover,PopoverTrigger,PopoverContent
}from "@/components/ui/popover";

import { useParams, usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { create } from '../../../convex/documents';
import { toast } from "sonner";
import { DocumentList } from "./documentlist";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";

export const Navigation = () => {
    const search = useSearch();
    const settings = useSettings();
    const params = useParams();
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)"); // 用于判断是否是移动端
    const create = useMutation(api.documents.create)
    
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);

    const [ isResetting, setIsResetting ] = useState(false);
    const [ isCollapsed, setIsCollapsed ] = useState(isMobile);

    useEffect(()=>{
        if (isMobile) {
            collapseWidth();
        }else { 
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
      if (isMobile) {
        collapseWidth();
      }
    }, [pathname,isMobile])
    

    const handleMouseDown = ( event:React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event:MouseEvent)=>{
        if (!isResizingRef.current) return; // 如果不是在拖动状态，就直接返回

        let newWidth = event.clientX; // 获取鼠标的位置
        if (newWidth < 240) {
            newWidth = 240;
        } else if (newWidth > 400) {
            newWidth = 400;
        }

        if (sidebarRef.current&&navbarRef.current) { // 这里的判断是为了防止报错，因为这两个 ref 可能为空
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    };
    const handleMouseUp = () => {
        isResizingRef.current = false; // 设置为非拖动状态
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };
    
    // 重置宽度
    const resetWidth = () => { 
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false); // 设置为非折叠状态
            setIsResetting(true); // 设置为正在重置状态

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");

            setTimeout(() =>  // 这里使用 setTimeout 是为了让动画效果更加平滑
                setIsResetting(false) // 设置为非重置状态
            , 300);
        }
    }
    // 折叠宽度
    const collapseWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true); // 设置为折叠状态
            setIsResetting(true); // 设置为正在重置状态

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("left", "0");
            navbarRef.current.style.setProperty("width", "100%");

            setTimeout(() => // 这里使用 setTimeout 是为了让动画效果更加平滑
                setIsResetting(false) // 设置为非重置状态
            , 300);
        }
    }
    // 创建文章
    const handleCreate = () => {
        const promise = create({ title: "Untitled" });
        // 通过 toast.promise 来显示 loading 和 success 或者 error

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!!",
            error: "Failed to create a new note."
        });
    }

    return (
    <>
        <aside
          ref={sidebarRef}
          className={cn(
            "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[100]",
            isResetting && "transition-all ease-in-out duration-300",
            isMobile && "w-0",
            )}
        >
            <div
            onClick={collapseWidth}
            role="button"
            className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
            )}>
                <ChevronsLeft className="h-6 w-6"
                />
            </div>
            <div>
                <UserItem/>
                <Item 
                    label="Search"
                    icon={Search}
                    isSearch
                    onClick={search.onOpen}
                />
                <Item 
                    label="Settings"
                    icon={Settings}
                    onClick={settings.onOpen}
                />
                <Item 
                    onClick={handleCreate} 
                    label="New Page" 
                    icon={PlusCircle}
                />
            </div>
            <div className="mt-4">
                <DocumentList />
                <Item 
                    onClick={handleCreate}
                    icon={Plus}
                    label="Add a page"
                />
                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item 
                            label="Trash"
                            icon={Trash}
                        />
                    </PopoverTrigger>
                    <PopoverContent 
                    className="p-0 w-72"
                    side={isMobile?"bottom":"right"}>
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>
            <div
                onMouseDown={handleMouseDown}
                onClick={resetWidth}
                className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0 shadow-red"
            />
        </aside>
        <div
            ref={navbarRef}
            className={cn(
                "absolute top-0 z-[100] left-60 w-[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full",
            )}
        >
            {!!params.documentId ? (
                <Navbar 
                    isCollapsed={isCollapsed}
                    onResetWidth={resetWidth}
                />
            ) : (
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && 
                      <MenuIcon
                      onClick={resetWidth}
                      role="button" 
                      className="h-6 w-6 text-muted-foreground"
                      />
                    }
                </nav>
            )}
        </div>
    </>
    )
}