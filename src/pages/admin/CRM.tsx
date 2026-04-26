import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { formatMWK } from "@/data/products";
import { Users, MessageCircle, Send, Search, Filter, Download, Phone, Mail, ShoppingCart, Calendar, Loader2, Check, Package, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface Customer {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  message: string;
  sent_count: number;
  created_at: string;
}

const AdminCRM = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "vip" | "new" | "inactive">("all");
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    message: "",
  });

  useEffect(() => {
    fetchCustomers();
    fetchCampaigns();
  }, []);

  const fetchCustomers = async () => {
    const { data: orders } = await supabase
      .from("orders")
      .select("customer_phone, customer_name, total_mwk, created_at")
      .order("created_at", { ascending: false });
    
    if (orders) {
      const phoneMap = new Map<string, Customer>();
      
      orders.forEach(order => {
        const phone = order.customer_phone;
        if (!phoneMap.has(phone)) {
          phoneMap.set(phone, {
            id: phone,
            user_id: "",
            email: "",
            full_name: order.customer_name || "Unknown",
            phone: phone,
            total_orders: 0,
            total_spent: 0,
            last_order_date: null,
            created_at: new Date().toISOString(),
          });
        }
        const customer = phoneMap.get(phone)!;
        customer.total_orders++;
        customer.total_spent += order.total_mwk || 0;
        if (!customer.last_order_date || order.created_at > customer.last_order_date) {
          customer.last_order_date = order.created_at;
        }
      });
      
      const customersData = Array.from(phoneMap.values()).sort((a, b) => b.total_spent - a.total_spent);
      setCustomers(customersData);
    }
    setLoading(false);
  };

  const fetchCampaigns = async () => {
    const { data } = await supabase.from("whatsapp_campaigns").select("*").order("created_at", { ascending: false }).limit(10);
    setCampaigns(data || []);
  };

  const sendCampaign = async () => {
    if (!campaignForm.message.trim()) return;
    setSending(true);

    try {
      const selectedCustomers = getFilteredCustomers();
      
      // Save campaign
      await supabase.from("whatsapp_campaigns").insert({
        name: campaignForm.name || `Campaign ${Date.now()}`,
        message: campaignForm.message,
        sent_count: selectedCustomers.length,
      });

      // Send to each customer via WhatsApp
      let sent = 0;
      for (const customer of selectedCustomers) {
        if (customer.phone) {
          const phone = customer.phone.replace(/[^0-9]/g, "");
          const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
          
          const msg = `💫 *PowerPod Update* 💫

${campaignForm.message}

Thanks for being a valued customer!

- PowerPod Team`;
          
          window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
          sent++;
          
          // Small delay between sends
          await new Promise(r => setTimeout(r, 500));
        }
      }

      toast({ title: `Campaign sent to ${sent} customers!` });
      setCampaignOpen(false);
      setCampaignForm({ name: "", message: "" });
      fetchCampaigns();
    } catch {
      toast({ title: "Error sending campaign", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const getFilteredCustomers = () => {
    let filtered = customers;
    
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.full_name.toLowerCase().includes(s) || 
        c.email.toLowerCase().includes(s) ||
        c.phone?.includes(s)
      );
    }

    switch (filter) {
      case "vip":
        filtered = filtered.filter(c => c.total_spent >= 50000);
        break;
      case "new":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(c => new Date(c.created_at) >= thirtyDaysAgo);
        break;
      case "inactive":
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        filtered = filtered.filter(c => !c.last_order_date || new Date(c.last_order_date) < ninetyDaysAgo);
        break;
    }

    return filtered;
  };

  const exportCustomers = () => {
    const data = getFilteredCustomers().map(c => ({
      Name: c.full_name,
      Email: c.email,
      Phone: c.phone,
      "Total Orders": c.total_orders,
      "Total Spent": c.total_spent,
      "Last Order": c.last_order_date || "Never",
    }));

    const csv = Object.keys(data[0] || {}).join(",") + "\n" + data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `powerpod-customers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const filteredCustomers = getFilteredCustomers();
  const totalSpent = customers.reduce((sum, c) => sum + c.total_spent, 0);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">CRM</h1>
          <p className="text-gray-500">Customer management & WhatsApp marketing</p>
        </div>
        <Button onClick={() => setCampaignOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Send className="h-4 w-4" /> Send Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-sm text-gray-500">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatMWK(totalSpent)}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{customers.reduce((s, c) => s + c.total_orders, 0)}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatMWK(customers.length > 0 ? Math.round(totalSpent / customers.length) : 0)}</p>
              <p className="text-sm text-gray-500">Avg Order Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === "all" ? "bg-gray-900 text-white" : "bg-card border border-border"}`}>
            All
          </button>
          <button onClick={() => setFilter("vip")} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === "vip" ? "bg-orange-500 text-white" : "bg-card border border-border"}`}>
            VIP (50K+)
          </button>
          <button onClick={() => setFilter("new")} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === "new" ? "bg-blue-500 text-white" : "bg-card border border-border"}`}>
            New (30 days)
          </button>
          <button onClick={() => setFilter("inactive")} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === "inactive" ? "bg-red-500 text-white" : "bg-card border border-border"}`}>
            Inactive
          </button>
        </div>
        <Button variant="outline" onClick={exportCustomers}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Customer List */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Phone</th>
              <th className="text-left p-4 font-medium">Orders</th>
              <th className="text-left p-4 font-medium">Total Spent</th>
              <th className="text-left p-4 font-medium">Last Order</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.slice(0, 50).map((customer) => (
              <tr key={customer.id} className="border-t border-gray-100">
                <td className="p-4">
                  <div>
                    <p className="font-medium">{customer.full_name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  {customer.phone ? (
                    <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                      {customer.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-4">{customer.total_orders}</td>
                <td className="p-4 font-medium">{formatMWK(customer.total_spent)}</td>
                <td className="p-4 text-sm text-gray-500">
                  {customer.last_order_date ? format(new Date(customer.last_order_date), "PP") : "Never"}
                </td>
                <td className="p-4 text-right">
                  {customer.phone && (
                    <Button variant="outline" size="sm" onClick={() => {
                      const phone = customer.phone.replace(/[^0-9]/g, "");
                      const waPhone = phone.startsWith("0") ? `265${phone.slice(1)}` : phone;
                      window.open(`https://wa.me/${waPhone}`, "_blank");
                    }}>
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-gray-500">No customers found</div>
        )}
      </div>

      {/* Campaign Modal */}
      {campaignOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4">
            <h2 className="font-bold text-xl">Send WhatsApp Campaign</h2>
            <p className="text-sm text-gray-500">This will open WhatsApp for {filteredCustomers.length} customers</p>
            
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                value={campaignForm.name}
                onChange={(e) => setCampaignForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Flash Sale Announcement"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Message *</Label>
              <textarea
                value={campaignForm.message}
                onChange={(e) => setCampaignForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Enter your message to customers..."
                className="w-full h-32 p-3 rounded-lg border border-gray-200"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCampaignOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={sendCampaign} disabled={sending || !campaignForm.message.trim()} className="flex-1 bg-green-600">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRM;