'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="relative inline-block w-12 h-6">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'peer sr-only',
          className
        )}
        {...props}
      />
      <div className="absolute w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600 transition-colors duration-200"></div>
      <div className="absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 peer-checked:left-7 transition-transform duration-200"></div>
    </div>
  );
});
Switch.displayName = 'Switch';

export { Switch };