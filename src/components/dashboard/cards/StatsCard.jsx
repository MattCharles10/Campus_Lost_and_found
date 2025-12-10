import React from 'react';
import {
  TrendingUp as ArrowUpRightIcon,
  TrendingDown as ArrowDownRightIcon
} from '@mui/icons-material';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'up', 
  color = 'purple',
  subtitle 
}) => {
  const colorClasses = {
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    teal: 'bg-gradient-to-br from-teal-500 to-teal-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
  };

  const colorIcons = {
    purple: 'text-purple-100 bg-purple-500/20',
    blue: 'text-blue-100 bg-blue-500/20',
    teal: 'text-teal-100 bg-teal-500/20',
    green: 'text-green-100 bg-green-500/20',
    red: 'text-red-100 bg-red-500/20',
    indigo: 'text-indigo-100 bg-indigo-500/20'
  };

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className={`stats-icon ${colorIcons[color]}`}>
          {icon}
        </div>
        <div className={`trend-indicator ${trendDirection}`}>
          {trendDirection === 'up' ? (
            <ArrowUpRightIcon fontSize="small" />
          ) : (
            <ArrowDownRightIcon fontSize="small" />
          )}
          <span>{trend}%</span>
        </div>
      </div>
      
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {subtitle && (
          <p className="stats-subtitle">{subtitle}</p>
        )}
      </div>
      
      <div className={`stats-gradient ${colorClasses[color]}`} />
    </div>
  );
};

export default StatsCard;