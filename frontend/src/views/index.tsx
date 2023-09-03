import { lazy } from 'react';

const Contacts = lazy(() => import('./Contacts'));
const Schedule = lazy(() => import('./Schedule'));
const Projects = lazy(() => import('./Marks.tsx'));
const Settings = lazy(() => import('./Settings'));
const LoginForm = lazy(() => import('./LoginForm'));

export {
  Contacts, Projects, Schedule, Settings, LoginForm,
};
