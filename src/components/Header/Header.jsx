import { useContext, useRef, useEffect, useState } from 'react';
import { Layout, Input, Dropdown, Button, Avatar, Tooltip, Grid } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SunOutlined,
  MoonOutlined,
  CheckCircleFilled,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

export const Header = ({ onMenuToggle }) => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isDarkMode,
    toggleTheme
  } = useContext(TaskContext);

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isSearchingMobile, setIsSearchingMobile] = useState(false);
  const searchInputRef = useRef(null);

  // Expose focus function through window or just let the keyboard hook handle it
  useEffect(() => {
    window.focusSearchInput = () => {
      if (isMobile) {
        setIsSearchingMobile(true);
      } else if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    return () => {
      delete window.focusSearchInput;
    };
  }, [isMobile]);

  useEffect(() => {
    if (isSearchingMobile && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isSearchingMobile]);

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

  // Expanded Full-width Search for Mobile Viewport
  if (isMobile && isSearchingMobile) {
    return (
      <AntHeader className="app-header" style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setIsSearchingMobile(false);
              setSearchQuery('');
            }}
            style={{ 
              fontSize: '16px', 
              height: '44px', 
              width: '44px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          />
          <Input
            ref={searchInputRef}
            placeholder="Search tasks..."
            prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={{
              borderRadius: '24px',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              height: '44px',
              color: 'var(--text-primary)',
              flex: 1,
              fontSize: '16px'
            }}
          />
        </div>
      </AntHeader>
    );
  }

  return (
    <AntHeader className="app-header" style={{ padding: isMobile ? '0 12px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Left side: Hamburger menu and Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flexShrink: 0 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuToggle}
          style={{ 
            fontSize: '16px', 
            height: isMobile ? '44px' : '32px', 
            width: isMobile ? '44px' : '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleFilled style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          {(!isMobile || screens.sm) && (
            <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Tasks
            </span>
          )}
        </div>
      </div>

      {/* Center: Search Input (Tablet/Desktop only) */}
      {!isMobile && (
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
      )}

      {/* Right side: Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '16px', flexShrink: 0 }}>
        {isMobile && (
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => setIsSearchingMobile(true)}
            style={{ 
              fontSize: '16px', 
              height: '44px', 
              width: '44px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          />
        )}

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
            style={{ 
              fontWeight: 500, 
              color: 'var(--text-secondary)', 
              height: isMobile ? '44px' : '32px', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            <span className="hide-on-mobile">{getSortLabel()}</span>
          </Button>
        </Dropdown>

        <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined style={{ color: '#fadb14' }} /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ 
              fontSize: '16px', 
              height: isMobile ? '44px' : '32px', 
              width: isMobile ? '44px' : '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
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
              color: '#fff',
              width: isMobile ? '36px' : '32px',
              height: isMobile ? '36px' : '32px'
            }}
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;

