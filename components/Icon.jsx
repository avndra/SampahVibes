import { cn } from '@/lib/utils';

const iconMap = {
  // Navigation Icons
  'home': '/icons/home.png',
  'shop': '/icons/shop.png',
  'cart': '/icons/cart.png',
  'scan': '/icons/scan.png',
  'search': '/icons/search.png',
  'filter': '/icons/filter.png',

  // User Profile Icons
  'user': '/icons/default_avatar.png',
  'log_out': '/icons/log_out.png',
  'edit': '/icons/edit.png',

  // Admin Icons
  'admin_dashboard': '/icons/admin_dashboard.png',
  'admin_products': '/icons/admin_products.png',
  'admin_settings': '/icons/admin_settings.png',
  'orderlist': '/icons/orderlist.png',
  'add': '/icons/add.png',
  'delete': '/icons/delete.png',

  // Category Icons
  'metal': '/icons/metal.png',
  'paper': '/icons/paper.png',
  'plastic': '/icons/plastic.png',

  // Activity Icons
  'points_earned': '/icons/points_earned.png',
  'redeem': '/icons/redeem.png',
  'camera': '/icons/camera.png',

  // Default fallback
  'default': '/icons/placeholder.png',
};

export default function Icon({ name, className, size = 24, alt, ...props }) {
  const iconPath = iconMap[name] || iconMap['default'];
  const altText = alt || `${name} icon`;

  return (
    <img
      src={iconPath}
      alt={altText}
      width={size}
      height={size}
      className={cn('object-contain', className)}
      {...props}
    />
  );
}