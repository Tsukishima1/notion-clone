"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

 // 这句代码是为了告诉编译器，这个文件是运行在浏览器环境中的，而不是 Node.js 环境中的

export const Heading = () => {
    return(
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents, & Plans, Unified, Welcome to 
                <span className="underline"> Jotion</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl">
                Jotion is the connected workspace where <br />
                better, faster work happens.
            </h3>
            <Button>
                Enter Jotion
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}

