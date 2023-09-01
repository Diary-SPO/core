import { lazy } from 'react';

const Contacts = lazy(() => import('./Contacts'));
const Profile = lazy(() => import('./Profile'));
const Projects = lazy(() => import('./Projects'));
const Settings = lazy(() => import('./Settings'));
const LoginForm = lazy(() => import('./LoginForm'));

export {
  Contacts, Projects, Profile, Settings, LoginForm,
};
