import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
        <input
          className={`
            w-full bg-white dark:bg-gray-950 
            text-gray-900 dark:text-gray-100 
            ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3
            rounded-xl border border-gray-200 dark:border-gray-800
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600
            transition-all duration-200
            placeholder:text-gray-400
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
