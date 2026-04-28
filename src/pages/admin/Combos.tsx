import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ComboItem {
  id: string;
  product_name: string;
}

interface Combo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  saving: number;
  vibe: string;
  image: string;
  images: string[];
  items: ComboItem[];
}

interface Product {
  id: string;
  name: string;
}

const AdminCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    price: 0,
    saving: 0,
    vibe: "",
    images: [""] as string[],
    item_names: [] as string[],
  });

  useEffect(() => {
    fetchCombos();
    fetchProducts();
  }, []);

  const fetchCombos = async () => {
    const { data: combosData } = await supabase
      .from("combos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (combosData) {
      const combosWithItems = await Promise.all(
        combosData.map(async (c) => {
          const { data: items } = await supabase
            .from("combo_items")
            .select("*")
            .eq("combo_id", c.id);
          return {
            ...c,
            items: items || [],
          };
        })
      );
      setCombos(combosWithItems);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name");
    setProducts(data || []);
  };

  const handleSave = async () => {
    if (!formData.name || formData.price <= 0) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    
    setSaving(true);
    try {
      const validImages = formData.images.filter(img => img.trim() !== "");
      const comboData = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        price: formData.price,
        saving: formData.saving,
        vibe: formData.vibe,
        image: validImages[0] || "",
        images: validImages,
        is_active: true,
        sort_order: 0,
      };

      if (editingCombo) {
        const { error } = await supabase.from("combos").update(comboData).eq("id", editingCombo.id);
        if (error) throw error;
        
        // Delete old items and add new ones
        await supabase.from("combo_items").delete().eq("combo_id", editingCombo.id);
        
        for (const name of formData.item_names) {
          const { error: itemError } = await supabase.from("combo_items").insert({
            combo_id: editingCombo.id,
            product_name: name,
          });
          if (itemError) console.error("Item error:", itemError);
        }
        
        toast({ title: "Combo updated!" });
      } else {
        const { data: newCombo, error: insertError } = await supabase
          .from("combos")
          .insert(comboData)
          .select()
          .single();
        
        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
        
        if (newCombo) {
          for (const name of formData.item_names) {
            await supabase.from("combo_items").insert({
              combo_id: newCombo.id,
              product_name: name,
            });
          }
        }
        
        toast({ title: "Combo created!" });
      }

      setIsDialogOpen(false);
      setEditingCombo(null);
      resetForm();
      fetchCombos();
    } catch (error: any) {
      console.error("Save combo error:", error);
      toast({ title: "Error saving combo", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this combo?")) {
      await supabase.from("combos").delete().eq("id", id);
      fetchCombos();
      toast({ title: "Combo deleted" });
    }
  };

  const handleEdit = (combo: Combo) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      tagline: combo.tagline || "",
      description: combo.description || "",
      price: combo.price,
      saving: combo.saving,
      vibe: combo.vibe || "",
      images: combo.images && combo.images.length > 0 ? combo.images : [combo.image || ""],
      item_names: combo.items.map(i => i.product_name),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      tagline: "",
      description: "",
      price: 0,
      saving: 0,
      vibe: "",
      images: [""],
      item_names: [],
    });
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      item_names: [...prev.item_names, ""],
    }));
  };

  const updateItem = (index: number, name: string) => {
    const newItems = [...formData.item_names];
    newItems[index] = name;
    setFormData((prev) => ({ ...prev, item_names: newItems }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      item_names: prev.item_names.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Combos</h1>
          <p className="text-gray-500">Manage bundle packages</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCombo(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4" /> Add Combo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCombo ? "Edit Combo" : "Add New Combo"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Combo Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Starter Pack"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                    placeholder="e.g., Keep going all day"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vibe Phrase</Label>
                  <Input
                    value={formData.vibe}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vibe: e.target.value }))}
                    placeholder="e.g., Start right"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., The basics to stay charged..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (MWK) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Savings (MWK)</Label>
                  <Input
                    type="number"
                    value={formData.saving}
                    onChange={(e) => setFormData((prev) => ({ ...prev, saving: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Combo Images</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus className="h-3 w-3" /> Add Image
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={img}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.images.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {formData.images[0] && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.images.filter(i => i).map((img, i) => (
                        <img key={i} src={img} alt={`Preview ${i}`} className="h-16 w-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Products in Combo</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-3 w-3" /> Add Product
                  </Button>
                </div>
                
                {/* Quick add from existing products */}
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {products.slice(0, 6).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          item_names: [...prev.item_names, p.name],
                        }))}
                        className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="space-y-2">
                  {formData.item_names.map((name, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={name}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder="Product name"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {formData.item_names.length === 0 && (
                    <p className="text-sm text-gray-400">No products added. Click "Add Product" above.</p>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleSave} 
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={saving || !formData.name}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingCombo ? "Update Combo" : "Add Combo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Combos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <div key={combo.id} className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-xl">{combo.name}</h3>
                <p className="text-sm text-orange-500 font-medium">{combo.tagline}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(combo)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(combo.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">{combo.description}</p>
            
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Package className="h-4 w-4" /> Products ({combo.items.length})
              </div>
              <div className="space-y-1">
                {combo.items.map((item) => (
                  <p key={item.id} className="text-sm">{item.product_name}</p>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Bundle Price</p>
                <p className="font-bold text-xl">MK {combo.price.toLocaleString()}</p>
                {combo.saving > 0 && (
                  <p className="text-xs text-green-500">Save MK {combo.saving.toLocaleString()}</p>
                )}
              </div>
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                {combo.vibe}
              </span>
            </div>
          </div>
        ))}
      </div>

      {combos.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Package className="h-12 w-12 mx-auto text-gray-300" />
          <p className="mt-4 text-gray-500">No combos yet. Create your first bundle!</p>
        </div>
      )}
    </div>
  );
};

export default AdminCombos;