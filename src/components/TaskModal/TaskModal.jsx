import { useContext, useState } from 'react';
import { Drawer, Input, DatePicker, Select, Button, Checkbox, Space, Divider, Typography, Grid } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  FolderOutlined,
  FlagOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';
import dayjs from 'dayjs';

const generateSubtaskId = () => `sub-${Date.now()}`;

const { TextArea } = Input;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export const TaskModal = ({ taskId, visible, onClose }) => {
  const { tasks, lists, updateTask, deleteTask, moveTaskToList, isDarkMode } = useContext(TaskContext);
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isXs = !screens.sm;

  const task = tasks.find(t => t.id === taskId);

  if (!task) return null;

  const handleTitleChange = (e) => {
    updateTask(task.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    updateTask(task.id, { description: e.target.value });
  };

  const handleDateChange = (date) => {
    updateTask(task.id, { dueDate: date ? date.toISOString() : null });
  };

  const handlePriorityChange = (val) => {
    updateTask(task.id, { priority: val });
  };

  const handleListChange = (val) => {
    moveTaskToList(task.id, val);
  };

  // Subtask Handlers
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;

    const newSubtask = {
      id: generateSubtaskId(),
      title: subtaskTitle.trim(),
      completed: false
    };

    updateTask(task.id, {
      subtasks: [...(task.subtasks || []), newSubtask]
    });
    setSubtaskTitle('');
  };

  const handleToggleSubtask = (subId) => {
    const updatedSubtasks = task.subtasks.map(sub => 
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleEditSubtask = (subId, newTitle) => {
    const updatedSubtasks = task.subtasks.map(sub => 
      sub.id === subId ? { ...sub, title: newTitle } : sub
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subId) => {
    const updatedSubtasks = task.subtasks.filter(sub => sub.id !== subId);
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    onClose();
  };



  return (
    <Drawer
      title="Task Details"
      placement="right"
      onClose={onClose}
      open={visible}
      style={{ width: isMobile ? '100%' : 460 }}
      extra={
        <Space>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteTask}
            style={{ height: isMobile ? '44px' : 'auto', display: 'flex', alignItems: 'center' }}
          >
            Delete Task
          </Button>
        </Space>
      }
      className={isDarkMode ? 'dark-theme-drawer' : ''}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title Input */}
        <div>
          <Input
            value={task.title}
            onChange={handleTitleChange}
            placeholder="Task Title"
            className="borderless-input"
            style={{ fontSize: '20px', fontWeight: 600 }}
          />
        </div>

        {/* Info Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* List selection */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isXs ? 'column' : 'row', 
            alignItems: isXs ? 'flex-start' : 'center', 
            gap: isXs ? '6px' : '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isXs ? '100%' : '110px' }}>
              <FolderOutlined style={{ color: 'var(--text-tertiary)', width: '20px' }} />
              <Text style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>List</Text>
            </div>
            <Select
              value={task.listId}
              onChange={handleListChange}
              style={{ width: '100%', flex: isXs ? 'none' : 1 }}
              options={lists.map(list => ({ value: list.id, label: list.name }))}
            />
          </div>

          {/* Due date picker */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isXs ? 'column' : 'row', 
            alignItems: isXs ? 'flex-start' : 'center', 
            gap: isXs ? '6px' : '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isXs ? '100%' : '110px' }}>
              <CalendarOutlined style={{ color: 'var(--text-tertiary)', width: '20px' }} />
              <Text style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Due Date</Text>
            </div>
            <DatePicker
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={handleDateChange}
              style={{ width: '100%', flex: isXs ? 'none' : 1 }}
              allowClear
              placeholder="Add due date"
            />
          </div>

          {/* Priority selector */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isXs ? 'column' : 'row', 
            alignItems: isXs ? 'flex-start' : 'center', 
            gap: isXs ? '6px' : '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isXs ? '100%' : '110px' }}>
              <FlagOutlined style={{ color: 'var(--text-tertiary)', width: '20px' }} />
              <Text style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Priority</Text>
            </div>
            <Select
              value={task.priority}
              onChange={handlePriorityChange}
              style={{ width: '100%', flex: isXs ? 'none' : 1 }}
              options={[
                { value: 'High', label: '🔴 High' },
                { value: 'Medium', label: '🟡 Medium' },
                { value: 'Low', label: '🔵 Low' }
              ]}
            />
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Description textarea */}
        <div>
          <Text strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Description
          </Text>
          <TextArea
            value={task.description}
            onChange={handleDescriptionChange}
            placeholder="Add details..."
            autoSize={{ minRows: 4, maxRows: 8 }}
            style={{
              padding: '10px',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Subtasks Section */}
        <div>
          <Text strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
            Subtasks
          </Text>

          {/* List of subtasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
            {task.subtasks && task.subtasks.map(subtask => (
              <div 
                key={subtask.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: isMobile ? '8px 12px' : '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Checkbox
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                  style={{ transform: isMobile ? 'scale(1.1)' : 'none' }}
                />
                <Input
                  value={subtask.title}
                  onChange={(e) => handleEditSubtask(subtask.id, e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    color: subtask.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    fontSize: '14px',
                    height: 'auto'
                  }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  style={{ 
                    width: isMobile ? '36px' : '24px', 
                    height: isMobile ? '36px' : '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Quick Subtask Input */}
          <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="Add a subtask..."
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              prefix={<PlusOutlined style={{ color: 'var(--text-tertiary)' }} />}
              style={{ borderRadius: '6px', height: isMobile ? '44px' : '36px' }}
            />
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlusOutlined />} 
              style={{ 
                height: isMobile ? '44px' : '36px', 
                width: isMobile ? '44px' : '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            />
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default TaskModal;

