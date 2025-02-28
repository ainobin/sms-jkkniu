import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider.jsx"

// pages
import {
  AboutDevelopers,
  DeptAdminPage,
  LoginPage,
  RegistrationForm,
  StoreManagerPage,
  RegisterPage
} from "./pages/pageIndex.js"
import { 
  Profile,
  AddNewItem,
  Restock,
  StockCheck, 
  Query,
  OrderForm
} from './components/index.js';

const router = createBrowserRouter([
  {
    element:<App/>,
    children:[
      { path: "/", element: <LoginPage /> },
      { path: "/developers", element: <AboutDevelopers /> },

      // Store Manager Page with Nested Routes
      {
        path: "/store-manager",
        element: <StoreManagerPage />, // Parent layout with <Outlet />
        children: [
          { path: "profile", element: <Profile/> },
          { path: "add-item", element: <AddNewItem/> },
          { path: "quries", element: <Query/> },
          { path: "stock-check", element: <StockCheck/> },
          { path: "restock", element: <Restock/> },
          { path: "register-new-user", element: <RegistrationForm/> },
        ],
      },
      {
        path: "/register",
        element: <RegisterPage />, // Parent layout with <Outlet />
        children: [
          { path: "profile", element: <Profile/> },
        ],
      },
      {
        path: "/dept-admin",
        element: <DeptAdminPage />, // Parent layout with <Outlet />
        children: [
          { path: "profile", element: <Profile/> },
          { path: "order-now", element: <OrderForm/> },
        ],
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>,
)
