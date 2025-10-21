import { createContext, useState, use } from "react";

const BlogsDrawerContext = createContext();
export const useBlogsDrawerContext = () => use(BlogsDrawerContext);

const BlogsDrawerProvider = ({children}) => {
    const [isDrawerOpened, setIsDrawerOpened] = useState(false)

    return (
        <BlogsDrawerContext.Provider value={{isDrawerOpened, setIsDrawerOpened}}>
            {children}
        </BlogsDrawerContext.Provider>
    )
}

export default BlogsDrawerProvider