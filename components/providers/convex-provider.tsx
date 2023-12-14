"use client";

import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// 在最后加一个感叹号，表示这个值一定存在，不然会报错

export const ConvextClientProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!} 
        >
            <ConvexProviderWithClerk
              useAuth={useAuth}
              client={convex}
            >
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
};