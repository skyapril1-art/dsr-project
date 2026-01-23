import { COLORS } from '@/app/lib/constants';

// Re-export COLORS for convenience
export { COLORS };

// Common UI Components Props
export interface IconProps {
  name: string;
  className?: string;
  ariaHidden?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

// Icon Component
export const Icon = ({ name, className = '', ariaHidden = true }: IconProps) => (
  <i 
    className={`fa-solid fa-${name} ${className}`} 
    aria-hidden={ariaHidden}
  />
);

// Card Component
export const Card = ({ children, className = '', hover = false }: CardProps) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}>
    {children}
  </div>
);

// Section Header Component
export const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
    {description && (
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
    )}
  </div>
);

// Page Header Component
export const PageHeader = ({ title, description }: { title: string; description: string }) => (
  <section className="text-center mb-12">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
  </section>
);

// Loading Spinner Component
export const LoadingSpinner = ({ message = '로딩 중...' }: { message?: string }) => (
  <div className="py-12 flex items-center justify-center" role="status" aria-live="polite">
    <div className="text-lg text-gray-600">{message}</div>
  </div>
);

// Empty State Component
export const EmptyState = ({ message, icon }: { message: string; icon?: string }) => (
  <div className="text-center py-12" role="status">
    {icon && <Icon name={icon} className="text-4xl text-gray-400 mb-4" />}
    <p className="text-gray-500">{message}</p>
  </div>
);

// Error Message Component
export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="py-12 flex items-center justify-center">
    <div className="text-lg text-red-600">{message}</div>
  </div>
);

// Button Component
export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Info Item Component (with icon)
export const InfoItem = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <p className="flex items-center text-sm text-gray-600">
    <Icon name={icon} className="mr-2" />
    <span>{children}</span>
  </p>
);

// Feature Card Component (used in About, Community pages)
export const FeatureCard = ({
  icon,
  title,
  description,
  color = COLORS.PRIMARY,
}: {
  icon: string;
  title: string;
  description: string;
  color?: string;
}) => (
  <div className="text-center">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <Icon name={icon} className="text-white text-2xl" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// Timeline Item Component (used in About page for history)
export const TimelineItem = ({ year, description }: { year: string; description: string }) => (
  <div className="flex items-start space-x-4">
    <div
      className="w-4 h-4 rounded-full mt-2"
      style={{ backgroundColor: COLORS.PRIMARY }}
    />
    <div>
      <h3 className="text-lg font-semibold">{year}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// Grid Container Component
export const Grid = ({
  children,
  cols = { md: 2, lg: 3 },
  gap = 6,
  className = '',
}: {
  children: React.ReactNode;
  cols?: { md?: number; lg?: number };
  gap?: number;
  className?: string;
}) => (
  <div
    className={`grid ${cols.md ? `md:grid-cols-${cols.md}` : ''} ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''} gap-${gap} ${className}`}
  >
    {children}
  </div>
);
