import React, { useContext, useState, useEffect } from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Checkbox, Space, Divider, Typography } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  CloseOutlined,
  FolderOutlined,
  FlagOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

export const TaskModal = ({ taskId, visible, onClose }) => {
  const { tasks, lists, updateTask, deleteTask, moveTaskToList, isDarkMode } = useContext(TaskContext);
  const [subtaskTitle, setSubtaskTitle] = useState('');

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
      id: `sub-${Date.now()}`,
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

  const getPriorityTagColor = (prio) => {
    switch (prio) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <Drawer
      title="Task Details"
      placement="right"
      onClose={onClose}
      open={visible}
      width={window.innerWidth < 768 ? '100%' : 460}
      extra={
        <Space>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteTask}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* List selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FolderOutlined style={{ color: 'var(--text-tertiary)', width: '20px' }} />
            <Text style={{ width: '80px', color: 'var(--text-secondary)' }}>List</Text>
            <Select
              value={task.listId}
              onChange={handleListChange}
              style={{ flex: 1 }}
              options={lists.map(list => ({ value: list.id, label: list.name }))}
            />
          </div>

          {/* Due date picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarOutlined style={{ color: 'var(--text-tertiary)', width: '20px' }} />
            <Text style={{ width: '80px', color: 'var(--text-secondary)' }}>Due Date</Text>
            <DatePicker
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={handleDateChange}
              style={{ flex: 1 }}
              allowClear
              placeholder="Add due date"
            />
          </div>

          {/* Priority selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FlagOutlined style={{ color: 'var(--text-tertiary)', width: '20px' }} />
            <Text style={{ width: '80px', color: 'var(--text-secondary)' }}>Priority</Text>
            <Select
              value={task.priority}
              onChange={handlePriorityChange}
              style={{ flex: 1 }}
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
              padding: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--text-primary)'
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
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Checkbox
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
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
                    color: subtask.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'
                  }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteSubtask(subtask.id)}
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
              style={{ borderRadius: '6px' }}
            />
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} />
          </form>
        </div>
      </div>
    </Drawer>
  );
};
export default TaskModal;
