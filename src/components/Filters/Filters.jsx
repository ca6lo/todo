import { useContext } from 'react';
import { Space, Select, Segmented, Button, Grid } from 'antd';
import {
  FilterOutlined,
  CloseOutlined,
  FlagOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';

const { useBreakpoint } = Grid;

export const Filters = () => {
  const { filters, setFilters } = useContext(TaskContext);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleStatusChange = (value) => {
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

  // Mobile Stacked Layout (3 rows: Label/Clear, Status Segmented, Select Dropdowns)
  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        transition: 'background-color var(--transition-speed), border-color var(--transition-speed)'
      }}>
        {/* Row 1: Filter Label and Clear Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FilterOutlined style={{ color: 'var(--primary-color)' }} />
            Filters
          </span>
          {hasActiveFilters && (
            <Button
              type="text"
              danger
              icon={<CloseOutlined />}
              onClick={clearAllFilters}
              style={{ fontSize: '13px', fontWeight: 500, height: '32px', padding: '0 8px' }}
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Row 2: Status Segmented Control */}
        <div style={{ width: '100%' }}>
          <Segmented
            options={['Pending', 'Completed', 'All']}
            value={currentStatusLabel()}
            onChange={handleStatusChange}
            style={{ fontWeight: 500, display: 'flex' }}
            block
          />
        </div>

        {/* Row 3: Priority & Due Date Select Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <Select
            value={filters.priority}
            onChange={(val) => setFilters({ priority: val })}
            style={{ flex: 1 }}
            suffixIcon={<FlagOutlined />}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'High', label: '🔴 High' },
              { value: 'Medium', label: '🟡 Medium' },
              { value: 'Low', label: '🔵 Low' }
            ]}
            classNames={{ popup: { root: 'dark-theme-dropdown' } }}
          />

          <Select
            value={filters.dueDate}
            onChange={(val) => setFilters({ dueDate: val })}
            style={{ flex: 1 }}
            suffixIcon={<CalendarOutlined />}
            options={[
              { value: 'all', label: 'All Dates' },
              { value: 'overdue', label: '⚠️ Overdue' },
              { value: 'today', label: '📅 Today' },
              { value: 'week', label: '🗓️ Week' },
              { value: 'nextWeek', label: '🗓️ Next Wk' }
            ]}
            classNames={{ popup: { root: 'dark-theme-dropdown' } }}
          />
        </div>
      </div>
    );
  }

  // Desktop Horizontal Layout
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
            classNames={{ popup: { root: 'dark-theme-dropdown' } }}
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
            classNames={{ popup: { root: 'dark-theme-dropdown' } }}
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

