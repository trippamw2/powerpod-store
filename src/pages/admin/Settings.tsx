import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, User, Phone } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      });

      if (error) throw error;
      toast({ title: "Settings saved", description: "Your profile has been updated." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-display font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage your admin account</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
        <h2 className="font-display font-semibold text-xl">Profile</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled />
            <p className="text-xs text-muted-foreground">Contact support to change your email</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                className="pl-10"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
        <h2 className="font-display font-semibold text-xl">Store Information</h2>
        <p className="text-muted-foreground">This information is displayed in the storefront.</p>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Store Name</span>
            <span>PowerPod</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">WhatsApp</span>
            <span>+265 888 000 000</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Location</span>
            <span>Malawi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;