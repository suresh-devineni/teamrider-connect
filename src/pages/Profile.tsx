
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { LogOut, Settings, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-24 px-4 pb-20">
        <Card className="p-6 mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <User className="h-8 w-8" />
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Your Profile</h2>
              <p className="text-gray-500">Manage your account</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
