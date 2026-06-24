import React, { useContext, useState, useRef, useEffect } from 'react';
import { Layout, Menu, Input, Button, Modal, Dropdown, Space, Progress, Tooltip } from 'antd';
import {
  UnorderedListOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { TaskContext } from '../../context/TaskContext';

const { Sider } = Layout;

export const Sidebar = ({ collapsed, mobileOpen, onMobileClose }) => {
  const {
    lists,
    tasks,
    activeListId,
    setActiveListId,
    createList,
    renameList,
    deleteList
  } = useContext(TaskContext);

  const [isCreating, setIsCreating] = useState(false);
  const [newListVal, setNewListVal] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingVal, setEditingVal] = useState('');
  
  const createInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (editingListId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingListId]);

  const handleCreateList = () => {
    if (newListVal.trim()) {
      const newId = createList(newListVal.trim());
      setNewListVal('');
      setIsCreating(false);
      if (onMobileClose) onMobileClose();
    } else {
      setIsCreating(false);
    }
  };

  const handleRenameList = (id) => {
    if (editingVal.trim()) {
      renameList(id, editingVal.trim());
      setEditingListId(null);
    } else {
      setEditingListId(null);
    }
  };

  const handleDeleteList = (id, name) => {
    Modal.confirm({
      title: 'Delete List',
      content: `Are you sure you want to delete the list "${name}"? All tasks within this list will be permanently deleted.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteList(id);
      }
    });
  };

  const getListProgress = (listId) => {
    const listTasks = tasks.filter(t => t.listId === listId);
    if (listTasks.length === 0) return 0;
    const completed = listTasks.filter(t => t.completed).length;
    return Math.round((completed / listTasks.length) * 100);
  };

  const getListCount = (listId) => {
    const pendingCount = tasks.filter(t => t.listId === listId && !t.completed).length;
    return pendingCount;
  };

  // Render a single list item
  const renderListElement = (list) => {
    const isEditing = editingListId === list.id;
    const isActive = activeListId === list.id;
    const progress = getListProgress(list.id);
    const count = getListCount(list.id);

    if (isEditing) {
      return (
        <div 
          key={list.id} 
          style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', width: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            ref={editInputRef}
            value={editingVal}
            onChange={(e) => setEditingVal(e.target.value)}
            onBlur={() => handleRenameList(list.id)}
            onPressEnter={() => handleRenameList(list.id)}
            size="small"
            style={{ borderRadius: '4px' }}
          />
        </div>
      );
    }

    const items = [
      {
        key: 'rename',
        label: 'Rename list',
        icon: <EditOutlined />,
        onClick: (e) => {
          e.domEvent.stopPropagation();
          setEditingListId(list.id);
          setEditingVal(list.name);
        }
      },
      ...(lists.length > 1 ? [{
        key: 'delete',
        label: 'Delete list',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (e) => {
          e.domEvent.stopPropagation();
          handleDeleteList(list.id, list.name);
        }
      }] : [])
    ];

    return (
      <div
        key={list.id}
        className={`sidebar-list-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          setActiveListId(list.id);
          if (onMobileClose) onMobileClose();
        }}
        onDoubleClick={() => {
          setEditingListId(list.id);
          setEditingVal(list.name);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderRadius: '0 24px 24px 0',
          marginRight: '8px',
          cursor: 'pointer',
          backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
          color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
          transition: 'all 0.2s',
          fontWeight: isActive ? 600 : 500,
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <FolderOpenOutlined style={{ fontSize: '16px', color: isActive ? 'var(--primary-color)' : 'var(--text-tertiary)' }} />
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            fontSize: '14px' 
          }}>
            {list.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
          <Tooltip title={`${progress}% completed`}>
            <div>
              <Progress
                type="circle"
                percent={progress}
                size={14}
                showInfo={false}
                strokeColor="var(--primary-color)"
                trailColor="var(--border-color)"
              />
            </div>
          </Tooltip>

          {count > 0 && (
            <span style={{
              fontSize: '11px',
              backgroundColor: isActive ? 'rgba(26,115,232,0.1)' : 'var(--bg-tertiary)',
              color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
              padding: '2px 6px',
              borderRadius: '10px',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              {count}
            </span>
          )}

          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ color: 'var(--text-tertiary)' }} />}
              size="small"
              className="list-action-btn"
              style={{ border: 'none', background: 'transparent' }}
            />
          </Dropdown>
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 0' }}>
      <div style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ 
          fontSize: '12px', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--text-tertiary)',
          fontWeight: 700 
        }}>
          My Lists
        </h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {lists.map(renderListElement)}

        {isCreating ? (
          <div style={{ padding: '4px 16px' }}>
            <Input
              ref={createInputRef}
              placeholder="New list name..."
              value={newListVal}
              onChange={(e) => setNewListVal(e.target.value)}
              onBlur={handleCreateList}
              onPressEnter={handleCreateList}
              size="small"
              style={{ borderRadius: '4px' }}
            />
          </div>
        ) : (
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setIsCreating(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '10px 16px',
              borderRadius: '0 24px 24px 0',
              marginRight: '8px',
              height: 'auto',
              color: 'var(--primary-color)',
              fontWeight: 500,
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            Create new list
          </Button>
        )}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Overall Progress</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-color)' }}>
            {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%
          </span>
        </div>
        <Progress 
          percent={Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)} 
          showInfo={false}
          strokeColor="var(--primary-color)"
          trailColor="var(--border-color)"
          size="small"
        />
      </div>
    </div>
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={0}
      width={280}
      style={{
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: '64px',
        left: 0,
        zIndex: 10
      }}
      className="app-sidebar"
    >
      {sidebarContent}
    </Sider>
  );
};
export default Sidebar;
