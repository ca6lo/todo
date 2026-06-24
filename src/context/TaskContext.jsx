/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

// Sample initial data for first-time users
const DEFAULT_LISTS = [
  { id: 'list-default', name: 'My Tasks', createdAt: new Date(2026, 5, 20).toISOString() },
  { id: 'list-work', name: 'Work Project', createdAt: new Date(2026, 5, 21).toISOString() }
];

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    listId: 'list-default',
    title: 'Welcome to Google Tasks Clone! 🚀',
    description: 'This is a premium task manager inspired by Google Tasks.\n\nHere are some things to try:\n1. Drag and drop tasks to reorder them.\n2. Click a task to open details and manage subtasks.\n3. Try sorting tasks by due date or priority.\n4. Use Keyboard shortcuts like "N" for new task.',
    dueDate: new Date().toISOString(), // Today
    priority: 'High',
    completed: false,
    createdAt: new Date(2026, 5, 23, 10, 0, 0).toISOString(),
    order: 0,
    subtasks: [
      { id: 'sub-1', title: 'Press "D" to toggle dark mode 🌙', completed: false },
      { id: 'sub-2', title: 'Double click lists in sidebar to rename them ✏️', completed: false },
      { id: 'sub-3', title: 'Mark this task as completed to see a confetti celebration! 🎉', completed: false }
    ]
  },
  {
    id: 'task-2',
    listId: 'list-default',
    title: 'Submit quarterly budget proposal 📊',
    description: 'Ensure finance team reviews all department numbers beforehand.',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday (Overdue)
    priority: 'High',
    completed: false,
    createdAt: new Date(2026, 5, 22, 9, 0, 0).toISOString(),
    order: 1,
    subtasks: []
  },
  {
    id: 'task-3',
    listId: 'list-default',
    title: 'Buy groceries 🍎',
    description: 'Milk, Eggs, Bread, Avocados, Coffee beans.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // In 2 days
    priority: 'Low',
    completed: false,
    createdAt: new Date(2026, 5, 23, 11, 0, 0).toISOString(),
    order: 2,
    subtasks: []
  },
  {
    id: 'task-4',
    listId: 'list-work',
    title: 'Setup Vite + React boilerplates 💻',
    description: 'Initialize application and configure theme styling and components.',
    dueDate: new Date().toISOString(),
    priority: 'High',
    completed: true,
    createdAt: new Date(2026, 5, 23, 8, 0, 0).toISOString(),
    order: 0,
    subtasks: []
  }
];

export const TaskProvider = ({ children }) => {
  // Load data from Local Storage or fallback to defaults
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('google_tasks_lists');
    return saved ? JSON.parse(saved) : DEFAULT_LISTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('google_tasks_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [activeListId, setActiveListId] = useState(() => {
    const savedActive = localStorage.getItem('google_tasks_active_list_id');
    if (savedActive) return savedActive;
    const saved = localStorage.getItem('google_tasks_lists');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_LISTS;
    return parsed.length > 0 ? parsed[0].id : '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFiltersState] = useState({
    priority: 'all',
    dueDate: 'all', // 'all', 'today', 'week', 'overdue'
    status: 'all' // 'all', 'pending', 'completed'
  });

  const [sortBy, setSortBy] = useState('order'); // 'order', 'dueDate', 'createdAt', 'priority'

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('google_tasks_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save to Local Storage on state change
  useEffect(() => {
    localStorage.setItem('google_tasks_lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('google_tasks_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('google_tasks_active_list_id', activeListId);
  }, [activeListId]);

  useEffect(() => {
    localStorage.setItem('google_tasks_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // List Actions
  const createList = (name) => {
    const newList = {
      id: `list-${Date.now()}`,
      name,
      createdAt: new Date().toISOString()
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    return newList.id;
  };

  const renameList = (id, newName) => {
    setLists(prev => prev.map(list => list.id === id ? { ...list, name: newName } : list));
  };

  const deleteList = (id) => {
    // Delete all tasks in the list
    setTasks(prev => prev.filter(task => task.listId !== id));
    // Delete the list
    setLists(prev => {
      const filtered = prev.filter(list => list.id !== id);
      // Adjust active list if the deleted one was active
      if (activeListId === id) {
        setActiveListId(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
  };

  // Task Actions
  const createTask = (taskData) => {
    // Determine the highest order currently in the active list
    const listTasks = tasks.filter(t => t.listId === (taskData.listId || activeListId) && !t.completed);
    const maxOrder = listTasks.reduce((max, t) => t.order > max ? t.order : max, -1);

    const newTask = {
      id: `task-${Date.now()}`,
      listId: taskData.listId || activeListId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'Medium',
      completed: false,
      createdAt: new Date().toISOString(),
      order: maxOrder + 1,
      subtasks: taskData.subtasks || []
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (taskId, updatedFields) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // If a task is being marked as completed, trigger confetti if appropriate
        const nextTask = { ...task, ...updatedFields };
        return nextTask;
      }
      return task;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const reorderTasks = (listId, startIndex, endIndex) => {
    setTasks(prev => {
      // Get all tasks of this list that are pending (drag-and-drop is only for pending tasks)
      const listTasks = prev.filter(t => t.listId === listId && !t.completed);
      // Sort them by their current order
      listTasks.sort((a, b) => a.order - b.order);

      const [removed] = listTasks.splice(startIndex, 1);
      listTasks.splice(endIndex, 0, removed);

      // Re-assign the orders based on new index
      const updatedOrdersMap = {};
      listTasks.forEach((task, index) => {
        updatedOrdersMap[task.id] = index;
      });

      return prev.map(task => {
        if (task.listId === listId && !task.completed && task.id in updatedOrdersMap) {
          return { ...task, order: updatedOrdersMap[task.id] };
        }
        return task;
      });
    });
  };

  const moveTaskToList = (taskId, targetListId) => {
    // Get the highest order in target list
    const targetTasks = tasks.filter(t => t.listId === targetListId && !t.completed);
    const maxOrder = targetTasks.reduce((max, t) => t.order > max ? t.order : max, -1);

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          listId: targetListId,
          order: maxOrder + 1
        };
      }
      return task;
    }));
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setFilters = (newFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <TaskContext.Provider value={{
      lists,
      tasks,
      activeListId,
      setActiveListId,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      sortBy,
      setSortBy,
      isDarkMode,
      toggleTheme,
      createList,
      renameList,
      deleteList,
      createTask,
      updateTask,
      deleteTask,
      reorderTasks,
      moveTaskToList
    }}>
      {children}
    </TaskContext.Provider>
  );
};
