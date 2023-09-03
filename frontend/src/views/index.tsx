import { lazy } from 'react';

const Contacts = lazy(() => import('./Contacts'));
const Schedule = lazy(() => import('./Schedule'));
const Marks = lazy(() => import('./Marks'));
const Settings = lazy(() => import('./Settings'));
const LoginForm = lazy(() => import('./LoginForm'));

export {
  Contacts, Marks, Schedule, Settings, LoginForm,
};
