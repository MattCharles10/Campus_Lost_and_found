import React from 'react';
import {
  Add as PlusIcon,
  Search as SearchIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  Help as HelpCircleIcon
} from '@mui/icons-material';

const QuickActionsCard = ({ 
  onReportItem, 
  onSearchItems, 
  onViewMyItems 
}) => {
  const actions = [
    {
      icon: <PlusIcon />,
      label: 'Report Item',
      description: 'Lost or found something?',
      color: 'purple',
      onClick: onReportItem
    },
    {
      icon: <SearchIcon />,
      label: 'Search Items',
      description: 'Browse lost & found items',
      color: 'blue',
      onClick: onSearchItems
    },
    {
      icon: <ListIcon />,
      label: 'My Items',
      description: 'View your reports',
      color: 'teal',
      onClick: onViewMyItems
    },
    {
      icon: <SettingsIcon />,
      label: 'Settings',
      description: 'Account preferences',
      color: 'indigo',
      onClick: () => console.log('Settings clicked')
    },
    {
      icon: <HelpCircleIcon />,
      label: 'Help & Support',
      description: 'Get assistance',
      color: 'green',
      onClick: () => console.log('Help clicked')
    }
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`action-btn ${action.color}`}
          onClick={action.onClick}
        >
          <div className="action-icon">
            {action.icon}
          </div>
          <div className="action-content">
            <span className="action-label">{action.label}</span>
            <span className="action-desc">{action.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsCard;