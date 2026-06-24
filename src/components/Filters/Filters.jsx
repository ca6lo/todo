import React, { useContext } from 'react';
import { Space, Select, Segmented, Button } from 'antd';
import {
  FilterOutlined,
  CloseOutlined,
  FlagOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';

export const Filters = () => {
  const { filters, setFilters } = useContext(TaskContext);

  const handleStatusChange = (value) => {
    // value will be 'pending', 'completed', or 'all'
    const statusMap = {
      'Pending': 'pending',
      'Completed': 'completed',
      'All': 'all'
    };
    setFilters({ status: statusMap[value] || 'all' });
  };

  const currentStatusLabel = () => {
    if (filters.status === 'pending') return 'Pending';
    if (filters.status === 'completed') return 'Completed';
    return 'All';
  };

  const hasActiveFilters = 
    filters.priority !== 'all' || 
    filters.dueDate !== 'all' || 
    filters.status !== 'all';

  const clearAllFilters = () => {
    setFilters({
      priority: 'all',
      dueDate: 'all',
      status: 'all'
    });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '12px 24px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      transition: 'background-color var(--transition-speed), border-color var(--transition-speed)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Space size="middle">
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FilterOutlined style={{ color: 'var(--primary-color)' }} />
            Filters:
          </span>

          <Segmented
            options={['Pending', 'Completed', 'All']}
            value={currentStatusLabel()}
            onChange={handleStatusChange}
            style={{ fontWeight: 500 }}
          />
        </Space>

        <Space wrap size="small">
          <Select
            value={filters.priority}
            onChange={(val) => setFilters({ priority: val })}
            style={{ width: 140 }}
            suffixIcon={<FlagOutlined />}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'High', label: '🔴 High Priority' },
              { value: 'Medium', label: '🟡 Medium Priority' },
              { value: 'Low', label: '🔵 Low Priority' }
            ]}
            popupClassName="dark-theme-dropdown"
          />

          <Select
            value={filters.dueDate}
            onChange={(val) => setFilters({ dueDate: val })}
            style={{ width: 140 }}
            suffixIcon={<CalendarOutlined />}
            options={[
              { value: 'all', label: 'All Dates' },
              { value: 'overdue', label: '⚠️ Overdue' },
              { value: 'today', label: '📅 Today' },
              { value: 'week', label: '🗓️ This Week' },
              { value: 'nextWeek', label: '🗓️ Next Week' }
            ]}
            popupClassName="dark-theme-dropdown"
          />
        </Space>
      </div>

      {hasActiveFilters && (
        <Button
          type="text"
          danger
          icon={<CloseOutlined />}
          onClick={clearAllFilters}
          style={{ fontSize: '13px', fontWeight: 500 }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default Filters;
