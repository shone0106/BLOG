import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import User from '../models/User'
import * as userApi from '../network/postApi'

interface AuthContext{
    user: User|null;
    showSignUp: boolean;
    showLogin: boolean;
    signUpClick: () => void;
    loginClick: () => void;
    onDismiss: () => void;
    onSuccess: (user: User) => void;
    onLogoutSuccess: () => void;
    setUser: (user: User) => void
}

const AuthContext = createContext({} as AuthContext)

export function useAuthContext(){
    return useContext(AuthContext)
}


export function AuthContextProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User|null>(null)
    
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    useEffect(()=>{
        async function getLoggedInUser() {
           try{
            const user = await userApi.getLoggedInUser()
            setUser(user)
           }
           catch(error){
            console.log(error)
           }
        }
        getLoggedInUser()
    },[])

    
    function signUpClick(){
        setShowSignUp(true)
    }

    function loginClick(){
        setShowLogin(true)
    }

    function onDismiss(){
        setShowLogin(false)
        setShowSignUp(false)
    }

    function onSuccess(user: User){
        console.log(user)
        setUser(user)
        onDismiss()
    }

    function onLogoutSuccess(){
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{user, showLogin, showSignUp, signUpClick, loginClick, onDismiss, onSuccess, onLogoutSuccess, setUser}}>
            {children}
        </AuthContext.Provider>
    )





}