'use client';

import { useState, useRef } from 'react';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { updateUserProfile } from '@/lib/actions/profile';
import { toast } from 'sonner';
import { Loader2, User, Phone, MapPin, Camera, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileEditModal({ isOpen, onClose, user }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateUserProfile(formData);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
      onClose();
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setPreviewAvatar(result.avatar);
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to upload avatar');
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error('Avatar upload error:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) return;

    setUploadingAvatar(true);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setPreviewAvatar(result.avatar);
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete avatar');
      }
    } catch (error) {
      toast.error('Failed to delete avatar');
      console.error('Avatar delete error:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✏️ Edit Profile" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center pb-6 border-b-2 border-gray-100 dark:border-gray-800">
          <div className="relative group">
            {/* Avatar Preview */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-xl">
              {previewAvatar ? (
                <Image
                  src={previewAvatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-6xl text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Upload Button Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <Camera className="h-8 w-8 text-white" />
            </button>
          </div>

          {/* Upload Controls */}
          <div className="flex gap-3 mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              variant="outline"
              size="sm"
              className="rounded-xl font-bold"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>

            {previewAvatar && !previewAvatar.includes('dicebear.com') && (
              <Button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={uploadingAvatar}
                variant="outline"
                size="sm"
                className="rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            JPG, PNG, GIF or WEBP • Max 5MB
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
            <User className="inline h-4 w-4 mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 outline-none transition-all font-semibold"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
            <Phone className="inline h-4 w-4 mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 outline-none transition-all font-semibold"
            placeholder="+62 812-3456-7890"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
            <MapPin className="inline h-4 w-4 mr-2" />
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 outline-none transition-all font-semibold resize-none"
            placeholder="Enter your full address..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-12 font-black"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-xl h-12 font-black"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}