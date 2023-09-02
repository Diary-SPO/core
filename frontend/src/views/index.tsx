import { lazy } from 'react';

const Contacts = lazy(() => import('./Contacts'));
const Schedule = lazy(() => import('./Schedule.tsx'));
const Projects = lazy(() => import('./Projects'));
const Settings = lazy(() => import('./Settings'));
const LoginForm = lazy(() => import('./LoginForm'));

export {
  Contacts, Projects, Schedule, Settings, LoginForm,
};
