import React, { createContext, useContext, useState } from 'react';
import { ActionTask, PriorityMatrixItem } from '../types/logistics';
import { INITIAL_TASKS, PRIORITY_MATRIX_ITEMS } from '../data/actionsData';

interface ActionContextType {
  tasks: ActionTask[];
  matrixItems: PriorityMatrixItem[];
  moveTask: (taskId: string, targetColumn: ActionTask['column']) => void;
  addTask: (task: Omit<ActionTask, 'id' | 'createdAt'>) => void;
  selectedTask: ActionTask | null;
  setSelectedTask: (task: ActionTask | null) => void;
  selectedMatrixItem: PriorityMatrixItem | null;
  setSelectedMatrixItem: (item: PriorityMatrixItem | null) => void;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ActionTask[]>(INITIAL_TASKS);
  const [matrixItems, setMatrixItems] = useState<PriorityMatrixItem[]>(PRIORITY_MATRIX_ITEMS);
  const [selectedTask, setSelectedTask] = useState<ActionTask | null>(null);
  const [selectedMatrixItem, setSelectedMatrixItem] = useState<PriorityMatrixItem | null>(null);

  const moveTask = (taskId: string, targetColumn: ActionTask['column']) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, column: targetColumn } : t))
    );
  };

  const addTask = (newTask: Omit<ActionTask, 'id' | 'createdAt'>) => {
    const task: ActionTask = {
      ...newTask,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [task, ...prev]);

    // Also add to priority matrix if high or critical
    if (newTask.impact === 'CRITICAL' || newTask.impact === 'HIGH') {
      const matrixItem: PriorityMatrixItem = {
        id: `mat-${Date.now()}`,
        title: newTask.title,
        impactScore: newTask.impact === 'CRITICAL' ? 90 : 75,
        urgencyScore: newTask.column === 'CRITICAL' ? 95 : 70,
        category: newTask.category,
        status: 'Open Action',
        affectedShipments: newTask.affectedShipments,
        actionPlan: newTask.recommendedAction
      };
      setMatrixItems(prev => [matrixItem, ...prev]);
    }
  };

  return (
    <ActionContext.Provider
      value={{
        tasks,
        matrixItems,
        moveTask,
        addTask,
        selectedTask,
        setSelectedTask,
        selectedMatrixItem,
        setSelectedMatrixItem
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useActions = () => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionProvider');
  }
  return context;
};
