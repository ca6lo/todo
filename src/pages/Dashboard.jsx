import React, { useState, useContext, useMemo } from 'react';
import { Layout, Input, Button, Collapse, Empty, Drawer, FloatButton } from 'antd';
import { PlusOutlined, MenuOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { TaskContext } from '../context/TaskContext';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import { Filters } from '../components/Filters/Filters';
import { TaskCard } from '../components/TaskCard/TaskCard';
import { TaskModal } from '../components/TaskModal/TaskModal';
import { useKeyboard } from '../hooks/useKeyboard';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Panel } = Collapse;

export const Dashboard = () => {
  const {
    lists,
    tasks,
    activeListId,
    searchQuery,
    filters,
    sortBy,
    toggleTheme,
    createTask,
    reorderTasks
  } = useContext(TaskContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  const activeList = lists.find(l => l.id === activeListId);

  // Helper date matching functions
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    return dayjs(dateStr).isSame(dayjs(), 'day');
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return dayjs(dateStr).isBefore(dayjs().startOf('day'), 'day');
  };

  const isThisWeek = (dateStr) => {
    if (!dateStr) return false;
    const date = dayjs(dateStr);
    const today = dayjs().startOf('day');
    const endOfWeek = dayjs().add(7, 'day').endOf('day');
    return date.isAfter(today.subtract(1, 'second')) && date.isBefore(endOfWeek);
  };

  const isNextWeek = (dateStr) => {
    if (!dateStr) return false;
    const date = dayjs(dateStr);
    const startOfNextWeek = dayjs().add(8, 'day').startOf('day');
    const endOfNextWeek = dayjs().add(15, 'day').endOf('day');
    return date.isAfter(startOfNextWeek.subtract(1, 'second')) && date.isBefore(endOfNextWeek);
  };

  // Keyboard shortcut config
  useKeyboard({
    onNewTask: () => {
      handleOpenNewTaskDrawer();
    },
    onToggleTheme: () => {
      toggleTheme();
    },
    onFocusSearch: () => {
      if (window.focusSearchInput) {
        window.focusSearchInput();
      }
    },
    onEscape: () => {
      setIsDrawerVisible(false);
      setSelectedTaskId(null);
    }
  });

  const handleOpenNewTaskDrawer = () => {
    const newTask = createTask({
      title: '',
      listId: activeListId,
      priority: 'Medium'
    });
    setSelectedTaskId(newTask.id);
    setIsDrawerVisible(true);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    createTask({
      title: quickTitle.trim(),
      listId: activeListId,
      priority: 'Medium'
    });
    setQuickTitle('');
  };

  const handleEditClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDrawerVisible(true);
  };

  // Filter & Sort tasks
  const processedTasks = useMemo(() => {
    let filtered = [...tasks];

    // If search active: search GLOBALLY across all lists, otherwise filter by active list
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    } else {
      filtered = filtered.filter(t => t.listId === activeListId);
    }

    // Filter by Priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    // Filter by Due Date
    if (filters.dueDate !== 'all') {
      filtered = filtered.filter(t => {
        if (filters.dueDate === 'today') return isToday(t.dueDate);
        if (filters.dueDate === 'overdue') return isOverdue(t.dueDate) && !t.completed;
        if (filters.dueDate === 'week') return isThisWeek(t.dueDate);
        if (filters.dueDate === 'nextWeek') return isNextWeek(t.dueDate);
        return true;
      });
    }

    // Filter by Status (completed vs pending)
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => 
        filters.status === 'completed' ? t.completed : !t.completed
      );
    }

    // Sort logic
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dayjs(a.dueDate).diff(dayjs(b.dueDate));
      }
      if (sortBy === 'createdAt') {
        return dayjs(b.createdAt).diff(dayjs(a.createdAt)); // Newest first
      }
      if (sortBy === 'priority') {
        const weights = { High: 3, Medium: 2, Low: 1 };
        return (weights[b.priority] || 0) - (weights[a.priority] || 0);
      }
      return a.order - b.order; // Default drag and drop ordering
    });

    return filtered;
  }, [tasks, activeListId, searchQuery, filters, sortBy]);

  // Separate pending and completed tasks for display
  const pendingTasks = useMemo(() => {
    return processedTasks.filter(t => !t.completed);
  }, [processedTasks]);

  const completedTasks = useMemo(() => {
    return processedTasks.filter(t => t.completed);
  }, [processedTasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Trigger reorder in the Context API
    reorderTasks(activeListId, source.index, destination.index);
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <Header onMenuToggle={() => {
        if (window.innerWidth < 768) {
          setMobileSidebarOpen(prev => !prev);
        } else {
          setSidebarCollapsed(prev => !prev);
        }
      }} />

      {/* Main Content Layout */}
      <Layout style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        {/* Desktop Sidebar Sider */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
        />

        {/* Mobile Sider Drawer wrapper */}
        <Drawer
          placement="left"
          onClose={() => setMobileSidebarOpen(false)}
          open={mobileSidebarOpen}
          width={280}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ display: 'none' }}
        >
          <Sidebar 
            collapsed={false} 
            mobileOpen={true}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </Drawer>

        {/* Action Panel and Task Lists */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          {/* Filter Bar */}
          <Filters />

          {/* Task Feed Layout */}
          <Content style={{ padding: '24px', overflowY: 'auto', flex: 1, position: 'relative' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              
              {/* Active List Heading */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {searchQuery.trim() ? `Search results for "${searchQuery}"` : (activeList ? activeList.name : 'Tasks')}
                </h1>
                {!searchQuery.trim() && (
                  <Button
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    onClick={handleOpenNewTaskDrawer}
                    style={{ fontWeight: 500 }}
                  >
                    Add Task
                  </Button>
                )}
              </div>

              {/* Quick Inline Task Add bar */}
              {!searchQuery.trim() && (
                <form onSubmit={handleQuickAdd} style={{ marginBottom: '24px' }}>
                  <Input
                    placeholder="+ Add a task to this list... (Press Enter to save)"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '15px',
                      padding: '0 16px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  />
                </form>
              )}

              {/* Pending List Area */}
              {pendingTasks.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="pending-tasks-list">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        {pendingTasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onEditClick={handleEditClick}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                completedTasks.length === 0 && (
                  <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <Empty 
                      description={
                        <span style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>
                          All tasks completed! Enjoy your day ☀️
                        </span>
                      } 
                    />
                  </div>
                )
              )}

              {/* Completed Tasks section dropdown (Collapsible) */}
              {completedTasks.length > 0 && (
                <Collapse
                  ghost
                  style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)' }}
                  defaultActiveKey={['completed-section']}
                >
                  <Panel 
                    header={
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Completed ({completedTasks.length})
                      </span>
                    } 
                    key="completed-section"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {completedTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onEditClick={handleEditClick}
                        />
                      ))}
                    </div>
                  </Panel>
                </Collapse>
              )}
            </div>
          </Content>
        </div>
      </Layout>

      {/* Floating Action Button for Mobile */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, display: window.innerWidth < 768 ? 'block' : 'none' }}
        onClick={handleOpenNewTaskDrawer}
      />

      {/* Slide Drawer detail modal */}
      <TaskModal
        taskId={selectedTaskId}
        visible={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedTaskId(null);
        }}
      />
    </Layout>
  );
};

export default Dashboard;
