"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// 这句代码是为了告诉编译器，这个文件是运行在浏览器环境中的，而不是 Node.js 环境中的

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents, & Plans, Unified, Welcome to
                <em></em> <span className="underline">Jotion</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl">
                Jotion is the connected workspace where <br />
                better, faster work happens.
            </h3>

            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg"></Spinner>
                </div>
            )}

            {!isAuthenticated && !isLoading && (
                <>
                    <SignInButton mode="modal">
                        <Button>
                            Get Jotion Free 
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </SignInButton>
                </>
            )}

            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                        Enter Jotion
                    </Link>
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            )}
        </div>
    )
}

