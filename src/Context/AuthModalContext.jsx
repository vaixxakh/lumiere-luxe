import { createContext, useContext, useState  } from "react";

const AuthModalContext = createContext()

export const  AuthModalProvider = ({ children}) =>{
    const [showLogin, setShowLogin] = useState(false);
    const [ showSignup, setShowSignup ] = useState(false);

    const [user, setUser ] = useState(
        JSON.parse(localStorage.getItem("userInfo"))
    )

    return(
        <AuthModalContext.Provider
        value={{
            showLogin,
            setShowLogin,
            showSignup,
            setShowSignup,
            user,
            setUser
        }}>
            {children}
        </AuthModalContext.Provider>
    )
}
export const useAuthModal = () => useContext(AuthModalContext);