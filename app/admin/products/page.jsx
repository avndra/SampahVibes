'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AdminProductForm from '@/components/admin/AdminProductForm';
import { useDebounce } from 'use-debounce';

export default function ModernAdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?page=${page}&search=${debouncedSearchTerm}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message);
        fetchProducts(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleActive = async (product) => {
    const updatedProductData = { ...product, isActive: !product.isActive };

    try {
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProductData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message);
        fetchProducts(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-500">Manage your reward catalog inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-green-600 transition-colors" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products List */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Product Catalog</CardTitle>
            <CardDescription>View and manage all available rewards</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="bg-gray-50 w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                          {product.category}
                        </Badge>
                        <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-100 text-green-700 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-600"}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">{product.pointsCost.toLocaleString()} <span className="text-xs font-medium text-gray-500">pts</span></p>
                      <p className={`text-sm font-medium ${product.stock < 10 ? 'text-orange-600' : 'text-gray-500'}`}>
                        Stock: {product.stock}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleActive(product)} className="h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                        {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)} className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or add a new product</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          Showing page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="rounded-lg"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="rounded-lg"
          >
            Next
          </Button>
        </div>
      </div>

      <AdminProductForm
        open={formOpen}
        onClose={handleFormClose}
        product={selectedProduct}
      />
    </div>
  );
}