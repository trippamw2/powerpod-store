import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products, formatMWK } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Package, Loader2, TrendingUp, TrendingDown, AlertTriangle, Warehouse } from "lucide-react";
import { format } from "date-fns";

interface InventoryItem {
  id: string;
  product_id: string;
  sku: string;
  quantity: number;
  reserved_quantity: number;
  reorder_level: number;
  cost_price_mwk: number;
  location: string;
  last_restocked: string;
}

interface InventoryTransaction {
  id: string;
  inventory_id: string;
  quantity_change: number;
  type: string;
  notes: string;
  created_at: string;
}

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [formData, setFormData] = useState({
    product_id: "",
    sku: "",
    quantity: 0,
    reorder_level: 5,
    cost_price_mwk: 0,
    location: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data } = await supabase
      .from("inventory")
      .select("*")
      .order("product_id");
    
    setInventory(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    const item = {
      product_id: formData.product_id,
      sku: formData.sku || `SKU-${Date.now()}`,
      quantity: formData.quantity,
      reserved_quantity: 0,
      reorder_level: formData.reorder_level,
      cost_price_mwk: formData.cost_price_mwk,
      location: formData.location,
    };

    const { error } = await supabase
      .from("inventory")
      .upsert(item, { onConflict: "product_id" });

    if (!error) {
      toast({ title: "Inventory saved!" });
      setIsDialogOpen(false);
      fetchInventory();
    }
  };

  const updateQuantity = async (item: InventoryItem, change: number, type: string, notes: string) => {
    await supabase
      .from("inventory")
      .update({ quantity: item.quantity + change })
      .eq("id", item.id);

    await supabase
      .from("inventory_transactions")
      .insert({
        inventory_id: item.id,
        quantity_change: change,
        type,
        notes,
      });

    fetchInventory();
  };

  const lowStock = inventory.filter(i => i.quantity <= i.reorder_level);
  const outOfStock = inventory.filter(i => i.quantity === 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Inventory</h1>
          <p className="text-muted-foreground">Stock management</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4" /> Add to Inventory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add to Inventory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <select 
                  value={formData.product_id}
                  onChange={(e) => setFormData(p => ({ ...p, product_id: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select product</option>
                  {products.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input 
                    value={formData.sku}
                    onChange={(e) => setFormData(p => ({ ...p, sku: e.target.value }))}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Reorder Level</Label>
                  <Input 
                    type="number"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData(p => ({ ...p, reorder_level: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost (MWK)</Label>
                  <Input 
                    type="number"
                    value={formData.cost_price_mwk}
                    onChange={(e) => setFormData(p => ({ ...p, cost_price_mwk: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    value={formData.location}
                    onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                    placeholder="Warehouse A"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">Save Inventory</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="font-display font-bold text-3xl">{inventory.length}</p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Total Stock</p>
          <p className="font-display font-bold text-3xl">
            {inventory.reduce((sum, i) => sum + i.quantity, 0)}
          </p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="font-display font-bold text-3xl text-yellow-500">{lowStock.length}</p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="font-display font-bold text-3xl text-red-500">{outOfStock.length}</p>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : inventory.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/60">
          <Warehouse className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No inventory yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">SKU</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Qty</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Cost</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const product = products.find(p => p.id === item.product_id);
                const isLow = item.quantity <= item.reorder_level;
                const isOut = item.quantity === 0;
                
                return (
                  <tr key={item.id} className="border-t border-border/50">
                    <td className="p-4">
                      <p className="font-medium">{product?.name || item.product_id}</p>
                      {item.last_restocked && (
                        <p className="text-xs text-muted-foreground">
                          Restocked: {format(new Date(item.last_restocked), "PP")}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-secondary rounded text-xs">{item.sku}</span>
                    </td>
                    <td className="p-4 text-sm">{item.location || "-"}</td>
                    <td className="p-4 font-bold">{item.quantity}</td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">Out of Stock</span>
                      ) : isLow ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">In Stock</span>
                      )}
                    </td>
                    <td className="p-4">{formatMWK(item.cost_price_mwk)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateQuantity(item, 10, "restock", "Quick restock")}
                        >
                          <TrendingUp className="h-3 w-3" /> Add
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateQuantity(item, -1, "sale", "Quick deduction")}
                        >
                          <TrendingDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;