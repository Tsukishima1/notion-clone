"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "shadow-sm border-b" // 如果scrolled为true，就添加shadow-sm border-b类
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {/* 如果没有加载完毕，就显示Spinner组件 */}
                {isLoading && (
                    <Spinner></Spinner>
                )}

                {/* 如果加载完毕并且没有认证，就显示登录按钮 */}
                {!isAuthenticated && !isLoading && (<>
                    {/* 这里mode定为modal的原因是：如果mode为page，那么点击登录按钮后，会跳转到登录页面，这样就会导致页面刷新，而我们不希望页面刷新 */}
                    <SignInButton mode="modal"> 
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                        <Button size="sm">
                            Get Jotion Free
                        </Button>
                    </SignInButton>
                </>
                )}

                {/* 如果加载完毕并且认证了，就显示进入Jotion按钮 */}
                {isAuthenticated && !isLoading && (
                <>
                    <Button
                      variant="ghost" size="sm" asChild
                    >
                        <Link href="/documents">Enter Jotion</Link>
                    </Button>
                    <UserButton
                      afterSignOutUrl="/"
                    />
                </>    
                )}
                <ModeToggle />
            </div>
        </div>
    );
}