import { lazy } from 'react'

const Schedule = lazy(() => import('./Schedule/Schedule.tsx'))
const Achievements = lazy(() => import('./Achievements'))
const Settings = lazy(() => import('./Settings'))
const LoginForm = lazy(() => import('./LoginForm'))
const Notifications = lazy(() => import('./Notifications.tsx'))

export { Achievements, Schedule, Settings, LoginForm, Notifications }
