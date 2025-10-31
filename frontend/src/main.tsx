import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashBoard from './pages/DashBoard.tsx'
import LoginPage from './pages/LoginPage.tsx'

const router = createBrowserRouter([
    {
      path:"/",
      element:<DashBoard/>
    },
    {
      path:"/auth",
      element:<LoginPage/>
    }
  ])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router}>
      </RouterProvider>
    </StrictMode>,  
)
