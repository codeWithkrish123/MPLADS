import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Legal Disclaimer Component
 * 
 * MANDATORY: Must appear on Dashboard, Project Detail, and Investigation views
 * Text is legally binding - any changes must be approved by legal team
 * 
 * This is a shared component - maintain in ONE place only
 */
interface LegalDisclaimerProps {
  /**
   * Size variant: 'sm' for cards, 'md' for standard, 'lg' for emphasis
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show icon
   */
  showIcon?: boolean;

  /**
   * Variant: 'light' for white background, 'dark' for subtle background
   */
  variant?: 'light' | 'dark';

  /**
   * CSS class for additional styling
   */
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  size = 'md',
  showIcon = true,
  variant = 'light',
  className = ''
}) => {
  // Exact legal text - DO NOT MODIFY without legal approval
  const disclaimerText = 
    "Risk scores indicate statistically unusual patterns in available historical records and are intended to support prioritization and human review. They do not independently establish fraud, misconduct, or legal liability.";

  const sizeClasses = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-3',
    lg: 'text-base px-5 py-4'
  };

  const variantClasses = {
    light: 'bg-white border border-amber-200',
    dark: 'bg-amber-50 border border-amber-200'
  };

  return (
    <div
      className={`flex gap-3 rounded-md ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      role="note"
      aria-label="Legal disclaimer"
    >
      {showIcon && (
        <AlertCircle 
          className={`flex-shrink-0 ${
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
          } text-amber-600 mt-0.5`}
        />
      )}
      
      <div className="flex-1">
        <p className="font-semibold text-amber-900 mb-1">
          Legal Disclaimer
        </p>
        <p className="text-amber-800 leading-relaxed">
          {disclaimerText}
        </p>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
