import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();

  if (customItems && customItems.length > 0) {
    return (
      <nav className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 mb-4 select-none">
        <Link to="/" className="flex items-center hover:text-cyan-300 transition-colors">
          <Home className="w-3.5 h-3.5 mr-1 text-slate-500" />
          <span>Control Tower</span>
        </Link>
        {customItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            {item.to ? (
              <Link to={item.to} className="hover:text-cyan-300 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-cyan-400 font-semibold">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  const pathParts = location.pathname.split('/').filter(Boolean);

  const getLabel = (part: string) => {
    switch (part) {
      case 'command-center': return 'Command Center';
      case 'network': return 'Live Network';
      case 'performance': return 'Delivery Performance';
      case 'delay-intelligence': return 'Delay Intelligence';
      case 'shipping-modes': return 'Shipping Modes';
      case 'regions': return 'Regional Operations';
      case 'shipments': return 'Shipment Explorer';
      case 'customers-products': return 'Customer & Product Intelligence';
      case 'simulator': return 'What-If Simulator';
      case 'actions': return 'Action Center';
      case 'reports': return 'Report Center';
      default: return part.toUpperCase();
    }
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 mb-4 select-none">
      <Link to="/" className="flex items-center hover:text-cyan-300 transition-colors">
        <Home className="w-3.5 h-3.5 mr-1 text-slate-500" />
        <span>Control Tower</span>
      </Link>
      {pathParts.map((part, index) => {
        const routeTo = `/${pathParts.slice(0, index + 1).join('/')}`;
        const isLast = index === pathParts.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            {isLast ? (
              <span className="text-cyan-400 font-semibold">{getLabel(part)}</span>
            ) : (
              <Link to={routeTo} className="hover:text-cyan-300 transition-colors">
                {getLabel(part)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
