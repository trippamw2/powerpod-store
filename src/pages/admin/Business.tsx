import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Building2, Loader2, Phone, MapPin } from "lucide-react";

interface BusinessAccount {
  id: string;
  user_id: string;
  company_name: string;
  business_type: string;
  tax_id: string;
  credit_limit_mwk: number;
  payment_terms: string;
  is_active: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  location: string;
}

const BUSINESS_TYPES = ["retailer", "wholesaler", "corporate", "hospital", "school", "hotel", "restaurant", "other"];
const PAYMENT_TERMS = ["prepaid", "net15", "net30", "net60"];

const AdminBusiness = () => {
  const [accounts, setAccounts] = useState<BusinessAccount[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BusinessAccount | null>(null);
  
  const [formData, setFormData] = useState({
    company_name: "",
    business_type: "retailer",
    tax_id: "",
    credit_limit_mwk: 0,
    payment_terms: "prepaid",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from("business_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setAccounts(data);
      const userIds = data.map(a => a.user_id);
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, phone, location")
          .in("id", userIds);
        
        if (profilesData) {
          const profileMap: Record<string, Profile> = {};
          profilesData.forEach(p => { profileMap[p.id] = p; });
          setProfiles(profileMap);
        }
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedAccount) {
      toast({ title: "Error", description: "Please select a user first", variant: "destructive" });
      return;
    }

    await supabase
      .from("business_accounts")
      .upsert({
        user_id: selectedAccount.user_id,
        company_name: formData.company_name,
        business_type: formData.business_type,
        tax_id: formData.tax_id,
        credit_limit_mwk: formData.credit_limit_mwk,
        payment_terms: formData.payment_terms,
      }, { onConflict: "user_id" });

    toast({ title: "Business account saved!" });
    setIsDialogOpen(false);
    fetchAccounts();
  };

  const toggleActive = async (account: BusinessAccount) => {
    await supabase
      .from("business_accounts")
      .update({ is_active: !account.is_active })
      .eq("id", account.id);
    fetchAccounts();
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Business Accounts</h1>
          <p className="text-muted-foreground">B2B customers with credit terms</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4" /> Add Business Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Business Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  value={formData.company_name}
                  onChange={(e) => setFormData(p => ({ ...p, company_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <select 
                  value={formData.business_type}
                  onChange={(e) => setFormData(p => ({ ...p, business_type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {BUSINESS_TYPES.map(t => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax ID (optional)</Label>
                  <Input 
                    value={formData.tax_id}
                    onChange={(e) => setFormData(p => ({ ...p, tax_id: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credit Limit (MWK)</Label>
                  <Input 
                    type="number"
                    value={formData.credit_limit_mwk}
                    onChange={(e) => setFormData(p => ({ ...p, credit_limit_mwk: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <select 
                  value={formData.payment_terms}
                  onChange={(e) => setFormData(p => ({ ...p, payment_terms: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {PAYMENT_TERMS.map(t => (
                    <option key={t} value={t}>{t === "prepaid" ? "Prepaid" : t}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSave} className="w-full">Save Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/60">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No business accounts yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const profile = profiles[account.user_id];
            return (
              <div key={account.id} className={`bg-card border border-border/60 rounded-2xl p-6 ${!account.is_active && "opacity-50"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{account.company_name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{account.business_type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${account.is_active ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"}`}>
                    {account.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                
                {profile && (
                  <div className="space-y-2 text-sm mb-4">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {profile.phone || "No phone"}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {profile.location || "No location"}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Credit Limit</p>
                    <p className="font-semibold">MWK {account.credit_limit_mwk.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Terms</p>
                    <p className="font-semibold">{account.payment_terms === "prepaid" ? "Prepaid" : account.payment_terms}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleActive(account)}>
                    {account.is_active ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBusiness;