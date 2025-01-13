import { Outlet } from 'react-router'
import { Layout } from './Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default App
