import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import AppLayout from './pages/AppLayout'
import Home from './pages/Home'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
      </Route>
    </Routes>
  )
}