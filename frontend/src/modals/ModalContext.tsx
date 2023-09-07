import React, {
  createContext, useContext, useState, ReactNode,
} from 'react';
import { Lesson } from '../../../shared';

const ModalContext = createContext<{
  modalData: Lesson | null;
  openModal:(data: Lesson) => void } | undefined>(
    undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalData, setModalData] = useState<Lesson | null>(null);

  const openModal = (data: Lesson) => {
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
