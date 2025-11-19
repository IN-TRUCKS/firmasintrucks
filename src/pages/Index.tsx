import { SignatureGenerator } from "@/components/SignatureGenerator";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <Header />
        <SignatureGenerator />
      </div>
    </ProtectedRoute>
  );
};

export default Index;
