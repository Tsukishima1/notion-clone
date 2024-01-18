import { create } from "zustand"; // zustand是一个状态管理库，类似于redux，但是更加轻量级使用起来更加简单

type SearchStore = { // 定义一个SearchState类型
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    toggle: () => void;
};

export const useSearch = create<SearchStore>((set,get) => ({
    // 创建一个useSearch的hook，返回一个SearchStore类型的对象，create的第一个参数是一个函数，函数的第一个参数是set，第二个参数是get，set用来设置状态，get用来获取状态
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    toggle: () => set({isOpen: !get().isOpen})
}))
