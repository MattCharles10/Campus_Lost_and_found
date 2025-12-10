import React from 'react';
import { Calendar, Target, Award } from 'lucide-react';

const WelcomeCard = ({ user }) => {
  return (
    <div className="welcome-card">
      <div className="welcome-header">
        <div className="welcome-avatar">
          <div className="avatar-placeholder">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="welcome-info">
          <h3>Welcome back!</h3>
          <p className="user-name">{user?.name || 'User'}</p>
          <p className="user-role">{user?.role || 'Member'}</p>
        </div>
      </div>
      
      <div className="user-stats">
        <div className="user-stat">
          <Calendar size={20} />
          <div>
            <p className="stat-number">24</p>
            <p className="stat-label">Days active</p>
          </div>
        </div>
        
        <div className="user-stat">
          <Target size={20} />
          <div>
            <p className="stat-number">15</p>
            <p className="stat-label">Items reported</p>
          </div>
        </div>
        
        <div className="user-stat">
          <Award size={20} />
          <div>
            <p className="stat-number">8</p>
            <p className="stat-label">Resolved cases</p>
          </div>
        </div>
      </div>
      
      <div className="welcome-message">
        <p>Keep up the great work helping our campus community!</p>
      </div>
    </div>
  );
};

export default WelcomeCard;