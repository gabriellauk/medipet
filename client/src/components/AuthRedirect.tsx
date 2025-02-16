import { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import { Navigate } from "react-router-dom";

export default function AuthRedirect() {
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
      const api = useApi();
    
      useEffect(() => {
        checkUserStatus();
      }, []);
    
      const checkUserStatus = async () => {
        try {
          const response = await api.get('/user');
          setUserIsLoggedIn(response.body.isLoggedIn);
        } catch (error) {
          console.error('Error checking user status:', error);
          setUserIsLoggedIn(false)
        }
        finally {
          setIsLoading(false)
        }
      };
    
  if (isLoading) {
        return <div>Loading...</div>;
    }
  
    if (userIsLoggedIn) { return <Navigate to="/test" replace />; }
      
    return <Navigate to="/login" replace />;
}