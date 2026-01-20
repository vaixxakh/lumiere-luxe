import { createContext, useContext, useState  } from "react";

const AuthModalContext = createContext()

export const  AuthModalProvider = ({ children}) =>{
    const [showLogin, setShowLogin] = useState(false);
    const [ showSignup, setShowSignup ] = useState(false);

    return(
        <AuthModalContext.Provider
        value={{
            showLogin,
            setShowLogin,
            showSignup,
            setShowSignup
        }}>
            {children}
        </AuthModalContext.Provider>
    )
}
export const useAuthModal = () => useContext(AuthModalContext);