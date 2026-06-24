import React, { useContext, useRef, useEffect } from 'react';
import { Layout, Input, Dropdown, Button, Space, Avatar, Tooltip } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SunOutlined,
  MoonOutlined,
  CheckCircleFilled,
  UserOutlined,
  CalendarOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';

const { Header: AntHeader } = Layout;

export const Header = ({ onMenuToggle }) => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isDarkMode,
    toggleTheme
  } = useContext(TaskContext);

  const searchInputRef = useRef(null);

  // Expose focus function through window or just let the keyboard hook handle it
  useEffect(() => {
    window.focusSearchInput = () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    return () => {
      delete window.focusSearchInput;
    };
  }, []);

  const sortItems = [
    {
      key: 'order',
      label: 'My Order (Drag & Drop)',
      icon: <SortAscendingOutlined />
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      icon: <CalendarOutlined />
    },
    {
      key: 'createdAt',
      label: 'Creation Date',
      icon: <ClockCircleOutlined />
    },
    {
      key: 'priority',
      label: 'Priority Level',
      icon: <InfoCircleOutlined />
    }
  ];

  const handleSortClick = ({ key }) => {
    setSortBy(key);
  };

  const getSortLabel = () => {
    const item = sortItems.find(i => i.key === sortBy);
    return item ? item.label : 'Sort';
  };

  return (
    <AntHeader className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuToggle}
          style={{ fontSize: '16px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleFilled style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            Tasks
          </span>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '600px', margin: '0 24px', position: 'relative' }}>
        <Input
          ref={searchInputRef}
          placeholder="Search your tasks... (Press 'S')"
          prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          style={{
            borderRadius: '24px',
            backgroundColor: 'var(--bg-tertiary)',
            border: 'none',
            height: '40px',
            color: 'var(--text-primary)',
            transition: 'all 0.3s'
          }}
          className="search-input"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <Dropdown
          menu={{
            items: sortItems,
            onClick: handleSortClick,
            selectable: true,
            selectedKeys: [sortBy]
          }}
          trigger={['click']}
        >
          <Button 
            type="text" 
            icon={<SortAscendingOutlined />}
            style={{ fontWeight: 500, color: 'var(--text-secondary)' }}
          >
            <span className="hide-on-mobile">{getSortLabel()}</span>
          </Button>
        </Dropdown>

        <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined style={{ color: '#fadb14' }} /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ fontSize: '16px' }}
          />
        </Tooltip>

        <Dropdown
          menu={{
            items: [
              {
                key: 'profile',
                label: 'vaish@example.com',
                disabled: true
              },
              {
                type: 'divider'
              },
              {
                key: 'settings',
                label: 'Settings'
              },
              {
                key: 'help',
                label: 'Help & feedback'
              }
            ]
          }}
          trigger={['click']}
        >
          <Avatar
            icon={<UserOutlined />}
            style={{
              cursor: 'pointer',
              backgroundColor: 'var(--primary-color)',
              color: '#fff'
            }}
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
};
export default Header;
