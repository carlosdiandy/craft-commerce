
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore, Shop } from '@/stores/authStore';
import { Product } from '@/stores/cartStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const ProductManagement = () => {
  const { user, addProductToShop, updateProductInShop, deleteProductFromShop } = useAuthStore();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const selectedShop = user?.shops?.find(shop => shop.id === selectedShopId);

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShopId) return;

    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Date.now().toString(), // Simple unique ID
      name: formData.get('productName') as string,
      description: formData.get('productDescription') as string,
      price: parseFloat(formData.get('productPrice') as string),
      stock: parseInt(formData.get('productStock') as string),
      image: 'https://via.placeholder.com/150', // Placeholder image
      shopId: selectedShopId,
      shopName: selectedShop?.name || '',
      category: 'General', // Default category
    };

    addProductToShop(selectedShopId, newProduct);
    toast({
      title: 'Produit ajouté',
      description: `${newProduct.name} a été ajouté à votre boutique.`,
    });
    e.currentTarget.reset();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShopId || !editingProduct) return;

    const formData = new FormData(e.currentTarget);
    const updatedProduct: Partial<Product> = {
      name: formData.get('productName') as string,
      description: formData.get('productDescription') as string,
      price: parseFloat(formData.get('productPrice') as string),
      stock: parseInt(formData.get('productStock') as string),
    };

    updateProductInShop(selectedShopId, editingProduct.id, updatedProduct);
    toast({
      title: 'Produit mis à jour',
      description: `${editingProduct.name} a été mis à jour.`,
    });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (!selectedShopId) return;
    deleteProductFromShop(selectedShopId, productId);
    toast({
      title: 'Produit supprimé',
      description: 'Le produit a été supprimé de votre boutique.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gérer mes produits</h1>
            <p className="text-muted-foreground">Ajoutez et modifiez les produits de vos boutiques</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">Retour au backoffice</Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner une boutique</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedShop}>
                <SelectTrigger className="w-full lg:w-1/3">
                  <SelectValue placeholder="Sélectionnez une boutique" />
                </SelectTrigger>
                <SelectContent>
                  {user?.shops?.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedShop && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Nom du produit</Label>
                        <Input id="productName" name="productName" defaultValue={editingProduct?.name || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productDescription">Description</Label>
                        <Input id="productDescription" name="productDescription" defaultValue={editingProduct?.description || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productPrice">Prix</Label>
                        <Input id="productPrice" name="productPrice" type="number" defaultValue={editingProduct?.price || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productStock">Stock</Label>
                        <Input id="productStock" name="productStock" type="number" defaultValue={editingProduct?.stock || ''} />
                      </div>
                      <Button type="submit">{editingProduct ? 'Mettre à jour le produit' : 'Ajouter le produit'}</Button>
                      {editingProduct && (
                        <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Annuler</Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Produits de la boutique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedShop?.products && selectedShop.products.length > 0 ? (
                        selectedShop.products.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                              <div>
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">{product.price}€ | Stock: {product.stock}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>Modifier</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>Supprimer</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center">Aucun produit dans cette boutique.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
