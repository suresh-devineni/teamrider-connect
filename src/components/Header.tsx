
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="px-4 py-6 bg-white/80 backdrop-blur-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">TeamRider</h1>
          <p className="text-sm text-gray-500 mt-1">Corporate Carpooling</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Login
        </Button>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};
