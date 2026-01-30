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
  CircularProgress,
  Typography
} from '@mui/material';
import { Close, CloudUpload, Delete } from '@mui/icons-material';
import { createProduct, updateProduct } from '@/lib/actions/products';
import { toast } from 'sonner';
import { PRODUCT_CATEGORIES } from '@/lib/config';

export default function AdminProductForm({ open, onClose, product }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'voucher',
    pointsCost: '',
    stock: '',
    image: '',
    images: [],
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
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
        isActive: product.isActive ?? true,
        featured: product.featured || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'voucher',
        pointsCost: '',
        stock: '',
        image: '',
        images: [],
        isActive: true,
        featured: false,
      });
    }
    setFiles([]); // Reset files on open/product change
  }, [product, open]);

  const handleMultiFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: updatedImages,
      image: updatedImages.length > 0 ? updatedImages[0] : '' // Ensure main image is sync
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let currentImages = [...formData.images];

    // Upload new files
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadPromises = files.map(async (file) => {
          const fileData = new FormData();
          fileData.append('file', file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: fileData,
          });
          const result = await res.json();
          if (!result.success) throw new Error(result.error);
          return result.url;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        currentImages = [...currentImages, ...newImageUrls];

      } catch (error) {
        toast.error(`Image upload failed: ${error.message}`);
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }

    // Ensure we have at least one image if possible, or use placeholder logic if needed.
    // Sync main 'image' field with the first image in array
    const mainImage = currentImages.length > 0 ? currentImages[0] : formData.image;

    const finalFormData = {
      ...formData,
      images: currentImages,
      image: mainImage
    };

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
        {product ? 'Edit Product' : 'Add New Product'}
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

            <Box sx={{ display: 'flex', gap: 2 }}>
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

            {/* Multiple Image Upload Section */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Product Images</Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
                {/* Existing Images */}
                {formData.images.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative', aspectRatio: '1/1' }}>
                    <img
                      src={img}
                      alt={`preview-${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {/* Pending Upload Files Previews (Simple count or name for now) */}
                {files.map((file, i) => (
                  <Box key={`new-${i}`} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: '#f5f5f5', borderRadius: 2, border: '1px dashed #ccc', aspectRatio: '1/1',
                    fontSize: '0.6rem', textAlign: 'center', p: 0.5
                  }}>
                    New: {file.name.substring(0, 10)}...
                  </Box>
                ))}
              </Box>

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
                Add Images
                <input type="file" multiple hidden accept="image/*" onChange={handleMultiFileChange} />
              </Button>
              {uploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
              {(files.length > 0) && <Typography variant="caption" sx={{ ml: 2 }}>{files.length} new files selected</Typography>}
            </Box>

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