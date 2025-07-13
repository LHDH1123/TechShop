import Header from "../../components/Header";
import MainContent from "../MainContent";
import { AuthProvider } from "../../Context/AuthContext"; // Import AuthProvider

const LayoutDefault = () => {
  return (
    <AuthProvider>
      <div>
        <Header />
        <MainContent />
      </div>
    </AuthProvider>
  );
};

export default LayoutDefault;
