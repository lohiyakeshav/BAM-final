
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // If the user is new, redirect to questionnaire
    if (user.isNewUser === true) {
      navigate("/questionnaire");
    }
  }, [navigate]);
  
  return <Dashboard />;
};

export default Index;
