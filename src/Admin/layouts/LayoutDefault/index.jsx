import React from "react";
import MainContent from "../MainContent";
import Sidebar from "../../../Admin/components/Sidebar";
import { AuthProvider } from "../../Context/Auth.context"; // Import AuthProvider

const LayoutDefault = () => {
  return (
    <AuthProvider>
      <div>
        <Sidebar />
        <MainContent />
      </div>
    </AuthProvider>
  );
};

export default LayoutDefault;
