import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LinkForm from "@/components/LinkForm";
import { Link } from "@/types";

const CreateLink = () => {
  const navigate = useNavigate();
  const handleLinkCreated = (link: Link) => {
    navigate("/dashboard");
  };
  
  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8">Create Link</h1>
        
        <div className="max-w-xl mx-auto w-full animate-fade-in">
          <LinkForm onSuccess={handleLinkCreated} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateLink;
