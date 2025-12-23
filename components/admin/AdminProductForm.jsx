'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { createProduct, updateProduct } from '@/lib/actions/products';
import { toast } from 'sonner';
import { PRODUCT_CATEGORIES } from '@/lib/config';

export default function AdminProductForm({ open, onClose, product }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'voucher',
    pointsCost: '',
    stock: '',
    image: '',
    isActive: true,
    featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'voucher',
        pointsCost: product.pointsCost || '',
        stock: product.stock || '',
        image: product.image || '',
        isActive: product.isActive ?? true,
        featured: product.featured || false,
      });
      setPreview(product.image || null);
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'voucher',
        pointsCost: '',
        stock: '',
        image: '',
        isActive: true,
        featured: false,
      });
      setPreview(null);
    }
    setFile(null); // Reset file on open/product change
  }, [product, open]);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = formData.image;

    // If a new file is selected, upload it first
    if (file) {
      setUploading(true);
      try {
        const fileData = new FormData();
        fileData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fileData,
        });

        const uploadResult = await res.json();

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Upload failed');
        }
        imageUrl = uploadResult.url;
      } catch (error) {
        toast.error(`Image upload failed: ${error.message}`);
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }

    const finalFormData = { ...formData, image: imageUrl };

    const result = product 
      ? await updateProduct(product._id, finalFormData)
      : await createProduct(finalFormData);

    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'black', fontSize: '1.5rem', pr: 6 }}>
        {product ? '✏️ Edit Product' : '➕ Add New Product'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              InputProps={{ sx: { fontWeight: 'bold' } }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              InputProps={{ sx: { fontWeight: 'bold' } }}
            />
            
            <Box sx={{ display: 'flex', gap: 2}}>
              <TextField
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                fullWidth
                InputProps={{ sx: { fontWeight: 'bold' } }}
              >
                {PRODUCT_CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Points Cost"
                type="number"
                value={formData.pointsCost}
                onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                required
                fullWidth
                InputProps={{ sx: { fontWeight: 'bold' } }}
              />
              <TextField
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                fullWidth
                InputProps={{ sx: { fontWeight: 'bold' } }}
              />
            </Box>

            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  borderRadius: 2, 
                  fontWeight: 'bold',
                  textTransform: 'none'
                }}
              >
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {uploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Box>
            
            {preview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={preview} alt="Product Preview" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', borderRadius: '8px' }} />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
                sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold' } }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                }
                label="Featured"
                sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold' } }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading || uploading}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            {loading ? (uploading ? 'Uploading...' : 'Saving...') : product ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}