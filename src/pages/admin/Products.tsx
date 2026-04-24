import { useState } from "react";
import { products, Product, Category, categories } from "@/data/products";
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
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";

const AdminProducts = () => {
  const [productsList, setProductsList] = useState(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    benefit: "",
    price: 0,
    category: "audio" as Category,
    types: [] as { id: string; name: string }[],
  });

  const handleSave = () => {
    if (editingProduct) {
      setProductsList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...formData, id: editingProduct.id, image: editingProduct.image } : p))
      );
    } else {
      const newProduct: Product = {
        ...formData,
        id: `p${Date.now()}`,
        image: "",
      };
      setProductsList((prev) => [...prev, newProduct]);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      benefit: product.benefit,
      price: product.price,
      category: product.category,
      types: product.types,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      benefit: "",
      price: 0,
      category: "audio",
      types: [],
    });
  };

  const addType = () => {
    setFormData((prev) => ({
      ...prev,
      types: [...prev.types, { id: `t${Date.now()}`, name: "" }],
    }));
  };

  const updateType = (index: number, name: string) => {
    const newTypes = [...formData.types];
    newTypes[index] = { ...newTypes[index], name };
    setFormData((prev) => ({ ...prev, types: newTypes }));
  };

  const removeType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      types: prev.types.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., PowerPods Wireless"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="benefit">Benefit/Description</Label>
                <Textarea
                  id="benefit"
                  value={formData.benefit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, benefit: e.target.value }))}
                  placeholder="e.g., True wireless freedom..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (MWK)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as Category }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                  >
                    {categories.filter(c => c.id !== "all").map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Types */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Product Types</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addType}>
                    <Plus className="h-3 w-3" /> Add Type
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.types.map((type, index) => (
                    <div key={type.id} className="flex gap-2">
                      <Input
                        value={type.name}
                        onChange={(e) => updateType(index, e.target.value)}
                        placeholder="e.g., Black, White, C to USB..."
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeType(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {formData.types.length === 0 && (
                    <p className="text-sm text-muted-foreground">No types added. Click "Add Type" to add variants.</p>
                  )}
                </div>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 font-medium">Product</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Types</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product) => (
              <tr key={product.id} className="border-t border-border/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.benefit}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="capitalize">{product.category}</span>
                </td>
                <td className="p-4">
                  <span className="font-semibold">MWK {product.price.toLocaleString()}</span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {product.types.map((t) => (
                      <span key={t.id} className="px-2 py-0.5 bg-secondary rounded text-xs">
                        {t.name}
                      </span>
                    ))}
                    {product.types.length === 0 && (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {productsList.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No products found. Add your first product.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;