import { useEffect } from "react";
import { useAuthModal } from "./Context/AuthModalContext";

 export default function AppInner() {
    
  const {
    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
  } = useAuthModal()

    useEffect(() => {
        if(showLogin || showSignup){
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return  () => {
            document.body.style.overflow = "auto";
        };
    }, [showLogin, showSignup])
 }