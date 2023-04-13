import { ReactNode, createContext, useState, useEffect, useContext } from "react";

import Post from '../models/Post'
import * as postApi from '../network/postApi'


interface postContext{
    posts: Post[];
    showNew: boolean;
    postToEdit: Post | null;
    onAddNewPostClick: () => void;
    onDismissNew: () => void;
    onDismissUpdate: () => void;
    onNewPostSaved: (postResponse: Post) => void;
    onUpdatePostSaved: (postResponse: Post) => void;
    onPostDeleted: (postId: string) => void
    onPostEditClick: (post: Post) => void;
}


const PostContext = createContext({} as postContext)

export function usePostContext(){
    return useContext(PostContext)
}

interface postContextProviderProps {
    children: ReactNode
}

export function PostContextProvider({ children }: postContextProviderProps) {

    const [posts, setPosts] = useState<Post[]>([])

    const [showNew, setShowNew] = useState(false)
    const [postToEdit, setPostToEdit] = useState<Post | null>(null)

    useEffect(() => {
        async function loadPosts() {
            try{
                const posts = await postApi.getPosts();
                setPosts(posts);
            }
            catch(error){
                console.log(error)
            }         
        }
        loadPosts();
    }, []);

    function onAddNewPostClick(){
        setShowNew(true)
    }

    function onNewPostSaved(postResponse: Post){
        setPosts([...posts, postResponse])
        setShowNew(false)
    }

    function onUpdatePostSaved(postResponse: Post){
        setPosts(posts.map(post => post._id == postResponse._id ? postResponse : post))
        setPostToEdit(null)
    }

    function onDismissNew(){
        setShowNew(false)
    }

    function onDismissUpdate(){
        setPostToEdit(null)
    }

    function onPostEditClick(post: Post){
        setPostToEdit(post)
    }

    function onPostDeleted(postId: string){
        setPosts(posts.filter(post => post._id != postId))
    }

    return (
        
        <PostContext.Provider value={{posts, showNew, postToEdit, onPostEditClick, onPostDeleted, onAddNewPostClick, onNewPostSaved, onUpdatePostSaved, onDismissNew, onDismissUpdate}}>
         { children }
        </PostContext.Provider>
    )

}