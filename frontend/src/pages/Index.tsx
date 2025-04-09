
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const Index = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      
      if (savedToken) {
        navigate("/dashboard");
        return;
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    navigate("/dashboard");
  };
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md text-center">
          <div className="loading-spinner text-xl">Checking authentication...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default Index;
