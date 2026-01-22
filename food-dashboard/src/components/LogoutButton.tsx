import { LogoutOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Button, message } from 'antd';
import { useState } from 'react';
import { Tooltip } from 'antd';

interface LogoutButtonProps {
  collapsed?: boolean;  // Add this prop to receive sidebar state
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed = false } ) => {
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      await request('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      message.error('Logout failed');
      console.error(error);
    } finally {
      localStorage.removeItem('rememberedEmail');
      window.location.href = '/login';
    }
  };
  
  return (
    <Tooltip title="Logout">
      <Button
        type="link"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        loading={loading}
        style={{ fontSize: '16px', marginLeft: collapsed ? 0 : '8px' }}
      >
        {!collapsed && 'Logout'}
      </Button>
    </Tooltip>
  );
};

export default LogoutButton;