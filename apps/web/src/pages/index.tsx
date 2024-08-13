import { lazy } from 'preact/compat'

const Schedule = lazy(() => import('./Schedule'))
const Achievements = lazy(() => import('./Achievements'))
const Settings = lazy(() => import('./Settings'))
const LoginForm = lazy(() => import('./LoginForm'))
const Notifications = lazy(() => import('./Notifications.tsx'))

export { Achievements, Schedule, Settings, LoginForm, Notifications }
