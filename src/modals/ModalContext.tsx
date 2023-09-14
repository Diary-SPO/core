import React, {
  ReactNode, createContext, useContext, useState, useMemo,
} from 'react';
import { Lesson, Organization } from 'diary-shared';

const ModalContext = createContext<{
  lessonModalData: Lesson | null;
  collegeModalData: Organization | null;
  openLessonModal:(data: Lesson) => void;
  openCollegeModal: (data: Organization) => void;
} | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lessonModalData, setLessonModalData] = useState<Lesson | null>(null);
  const [collegeModalData, setCollegeModalData] = useState<Organization | null>(null);

  const openLessonModal = (data: Lesson) => {
    setLessonModalData(data);
  };

  const openCollegeModal = (data: Organization) => {
    setCollegeModalData(data);
  };

  const contextValue = useMemo(() => ({
    lessonModalData,
    collegeModalData,
    openLessonModal,
    openCollegeModal,
  }), [lessonModalData, collegeModalData]);

  return (
    <ModalContext.Provider value={contextValue}>
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
