import Sidebar from '../Sidebar/Sidebar'
import '../Layout/layout.scss'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
