import React, {
  createContext, useContext, useState, ReactNode,
} from 'react';
import { Gradebook, Task, Timetable } from '../../../shared';

interface ModalData {
  name: string;
  endTime: string;
  startTime: string;
  timetable: Timetable;
  gradebook?: Gradebook | undefined;
  tasks?: Task[] | undefined;
  lessonId: string;
}

const ModalContext = createContext<{ modalData: ModalData | null; openModal:(data: { name: string; lessonId: string; startTime: string; endTime: string; gradebook: Gradebook | undefined; tasks: Task[] | undefined; timetable: Timetable }) => void } | undefined>(
  undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = (data: ModalData) => {
    setModalData(data);
  };

  return (
    <ModalContext.Provider value={{ modalData, openModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
