import { createContext, useContext, useState, useEffect } from "react";

const BlogsDrawerContext = createContext();
export const useBlogsDrawerContext = () => useContext(BlogsDrawerContext);

const BlogsDrawerProvider = ({children}) => {
    const [isDrawerOpened, setIsDrawerOpened] = useState(false)

    return (
        <BlogsDrawerContext.Provider value={{isDrawerOpened, setIsDrawerOpened}}>
            {children}
        </BlogsDrawerContext.Provider>
    )
}

export default BlogsDrawerProvider