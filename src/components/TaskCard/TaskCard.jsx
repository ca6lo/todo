import React, { useContext } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Space, Tag, Dropdown, Button, Tooltip, Checkbox } from 'antd';
import {
  HolderOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  SubnodeOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';
import dayjs from 'dayjs';
import confetti from 'canvas-confetti';

export const TaskCard = ({ task, index, onEditClick }) => {
  const { updateTask, deleteTask, moveTaskToList, lists } = useContext(TaskContext);

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    const isNowCompleted = !task.completed;
    
    updateTask(task.id, { completed: isNowCompleted });

    if (isNowCompleted) {
      // Trigger a celebratory confetti blast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  };

  const handleSubtaskToggle = (e, subId) => {
    e.stopPropagation();
    const updatedSubtasks = task.subtasks.map(sub => 
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleMoveToList = (targetListId) => {
    moveTaskToList(task.id, targetListId);
  };

  // Date Tag Styling
  const getDateTag = () => {
    if (!task.dueDate) return null;
    
    const dueDate = dayjs(task.dueDate);
    const today = dayjs().startOf('day');
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    
    let label = dueDate.format('MMM D, YYYY');
    let color = 'default';
    let isOverdue = false;

    if (dueDate.isBefore(today, 'day') && !task.completed) {
      label = `Overdue: ${dueDate.format('MMM D')}`;
      color = 'error';
      isOverdue = true;
    } else if (dueDate.isSame(today, 'day')) {
      label = 'Today';
      color = 'warning';
    } else if (dueDate.isSame(tomorrow, 'day')) {
      label = 'Tomorrow';
      color = 'processing';
    }

    return (
      <Tooltip title={dueDate.format('LL')}>
        <Tag color={color} icon={<CalendarOutlined />} style={{ borderRadius: '12px' }}>
          {label}
        </Tag>
      </Tooltip>
    );
  };

  // Priority Tag Styling
  const getPriorityTag = () => {
    if (task.completed) return null;
    
    switch (task.priority) {
      case 'High':
        return <Tag color="error" style={{ borderRadius: '12px', fontWeight: 600 }}>High</Tag>;
      case 'Medium':
        return <Tag color="warning" style={{ borderRadius: '12px', fontWeight: 600 }}>Medium</Tag>;
      case 'Low':
        return <Tag color="blue" style={{ borderRadius: '12px', fontWeight: 600 }}>Low</Tag>;
      default:
        return null;
    }
  };

  // Subtask counts
  const subtaskCount = task.subtasks ? task.subtasks.length : 0;
  const completedSubtaskCount = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;

  // Options Menu for Task Actions
  const otherLists = lists.filter(l => l.id !== task.listId);
  const actionItems = [
    {
      key: 'edit',
      label: 'Open Details',
      icon: <EditOutlined />,
      onClick: () => onEditClick(task.id)
    },
    {
      type: 'divider'
    },
    ...(otherLists.length > 0 ? [{
      key: 'move-to',
      label: 'Move to list',
      icon: <ArrowRightOutlined />,
      children: otherLists.map(l => ({
        key: `move-${l.id}`,
        label: l.name,
        onClick: () => handleMoveToList(l.id)
      }))
    }] : []),
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete
    }
  ];

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={task.completed}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-card-container ${snapshot.isDragging ? 'task-card-dragging' : ''}`}
          onClick={() => onEditClick(task.id)}
          style={{
            ...provided.draggableProps.style,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {/* Drag Handle */}
            {!task.completed && (
              <div
                {...provided.dragHandleProps}
                style={{
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '2px',
                  color: 'var(--text-tertiary)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <HolderOutlined />
              </div>
            )}

            {/* Checkbox (Circle) */}
            <div
              className={`task-checkbox ${task.completed ? 'completed' : ''}`}
              onClick={handleCheckboxClick}
              style={{ marginTop: '2px' }}
            />

            {/* Task Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div 
                className={`task-title ${task.completed ? 'completed' : ''}`}
                style={{ 
                  fontSize: '15px', 
                  fontWeight: 500, 
                  lineHeight: '1.4',
                  color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'
                }}
              >
                {task.title}
              </div>

              {task.description && !task.completed && (
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {task.description.split('\n')[0]}
                </div>
              )}

              {/* Tags Section */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {getPriorityTag()}
                {getDateTag()}
                {subtaskCount > 0 && (
                  <Tag icon={<SubnodeOutlined />} style={{ borderRadius: '12px' }}>
                    {completedSubtaskCount}/{subtaskCount} Subtasks
                  </Tag>
                )}
              </div>
            </div>

            {/* Quick Actions Dropdown */}
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
                <Button
                  type="text"
                  icon={<MoreOutlined style={{ color: 'var(--text-tertiary)' }} />}
                  size="small"
                />
              </Dropdown>
            </div>
          </div>

          {/* Inline Subtasks List (Indented under TaskCard) */}
          {subtaskCount > 0 && !task.completed && (
            <div 
              style={{
                marginLeft: '36px',
                marginTop: '4px',
                paddingTop: '6px',
                borderTop: '1px dashed var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {task.subtasks.map(sub => (
                <div
                  key={sub.id}
                  onClick={(e) => handleSubtaskToggle(e, sub.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: sub.completed ? 'var(--text-tertiary)' : 'var(--text-secondary)'
                  }}
                >
                  <Checkbox 
                    checked={sub.completed} 
                    onClick={e => e.stopPropagation()} 
                    onChange={e => handleSubtaskToggle(e, sub.id)}
                    style={{ pointerEvents: 'none' }} // Let container click trigger toggle
                  />
                  <span style={{ textDecoration: sub.completed ? 'line-through' : 'none' }}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
export default TaskCard;
