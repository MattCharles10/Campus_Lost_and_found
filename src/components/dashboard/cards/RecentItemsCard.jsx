import React from 'react';
import {
  AccessTime as ClockIcon,
  LocationOn as MapPinIcon,
  Person as UserIcon
} from '@mui/icons-material';

const RecentItemsCard = ({ items = [] }) => {
  return (
    <div className="recent-items">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="recent-item">
            <div className="item-type">
              <span className={`type-badge ${item.type}`}>
                {item.type === 'lost' ? 'LOST' : 'FOUND'}
              </span>
            </div>
            
            <div className="item-content">
              <h4 className="item-title">{item.title}</h4>
              
              <div className="item-meta">
                <span className="meta-item">
                  <ClockIcon fontSize="small" />
                  {item.timeAgo}
                </span>
                
                <span className="meta-item">
                  <MapPinIcon fontSize="small" />
                  {item.location}
                </span>
                
                {item.reportedBy && (
                  <span className="meta-item">
                    <UserIcon fontSize="small" />
                    {item.reportedBy}
                  </span>
                )}
              </div>
              
              <div className="item-category">
                <span className="category-tag">{item.category}</span>
              </div>
            </div>
            
            <div className="item-actions">
              <button className="view-btn">View</button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-items">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentItemsCard;