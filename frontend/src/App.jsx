import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import TaskList from './pages/TaskList.jsx'
import TaskCreate from './pages/TaskCreate.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Task Manager</div>
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/tasks/new">New Task</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskCreate />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
