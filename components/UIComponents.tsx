import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const variants = {
    primary: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:ring-yellow-400 shadow-sm border border-transparent",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 shadow-sm border border-transparent",
    outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm border border-transparent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base"
  };

  return (
    <button 
      className={`
        ${baseStyle} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, interactive }) => (
  <div 
    onClick={onClick} 
    className={`
      bg-white rounded-2xl p-4 border border-gray-100 shadow-sm
      ${(onClick || interactive) ? 'cursor-pointer active:bg-gray-50 active:scale-[0.99] transition-transform' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode, color?: string, className?: string }> = ({ 
  children, 
  color = 'bg-gray-100 text-gray-600',
  className = ''
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color} ${className}`}>
    {children}
  </span>
);

// --- Navbar ---
export const Navbar: React.FC<{ title: string, rightAction?: React.ReactNode, leftAction?: React.ReactNode }> = ({ title, rightAction, leftAction }) => (
  <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 h-14 flex items-center justify-between shadow-sm transition-all">
    <div className="flex items-center gap-2 flex-1">
      {leftAction && <div className="mr-1">{leftAction}</div>}
      <h1 className="font-bold text-lg text-gray-900 tracking-tight truncate">{title}</h1>
    </div>
    <div className="flex-none pl-2">{rightAction}</div>
  </div>
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', icon, label, containerClassName = '', ...props }) => (
  <div className={`w-full ${containerClassName}`}>
    {label && <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">{label}</label>}
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-500 transition-colors">
          {icon}
        </div>
      )}
      <input 
        className={`
          w-full bg-gray-50 border border-transparent text-gray-900 text-sm rounded-xl 
          focus:ring-2 focus:ring-yellow-400 focus:bg-white focus:border-transparent
          block py-3 ${icon ? 'pl-10 pr-4' : 'px-4'} 
          transition-all outline-none
          placeholder:text-gray-400
          ${className}
        `}
        {...props}
      />
    </div>
  </div>
);

// --- TextArea ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ className = '', label, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">{label}</label>}
    <textarea 
      className={`
        w-full bg-gray-50 border border-transparent text-gray-900 text-sm rounded-xl 
        focus:ring-2 focus:ring-yellow-400 focus:bg-white focus:border-transparent
        block p-3 
        transition-all outline-none resize-none
        placeholder:text-gray-400
        ${className}
      `}
      {...props}
    />
  </div>
);