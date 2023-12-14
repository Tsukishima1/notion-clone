import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils"; // 这里的 cn 是 classnames 的简写

const font = Poppins({ // 这里的 Poppins 是字体的名字
    subsets: ["latin"], // 拉丁字母
    weight: ["400", "600"],
});

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image
                src="/logo.svg"
                height="40"
                width="40"
                alt="Logo"
                className="dark:hidden"
            />
            <Image
                src="/logo-dark.svg"
                height="40"
                width="40"
                alt="Logo"
                className="hidden dark:block"
            />
            <p className={cn("font-semibold", font.className)}>
                Jotion
            </p>
        </div>
    );
};

