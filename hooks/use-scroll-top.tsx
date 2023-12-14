import { useState, useEffect } from 'react';

export const useScrollTop = (threshold = 10) => {
    // threshold=10意思是滚动距离超过10px就显示回到顶部按钮
    const [scrolled, setScrolled] = useState(false);

    useEffect(()=>{
        const handleScroll = () => {
            // const isScrolled = window.scrollY > threshold;
            // if (isScrolled !== scrolled) {
            //     setScrolled(!scrolled);
            // }
            // 上面的代码等价于下面的代码
            setScrolled(window.scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ threshold ]);

    return scrolled;
}