import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './components/PublicSite'
import Login from './admin/auth/Login'
import RequireAuth from './admin/auth/RequireAuth'
import Editor from './admin/shell/Editor'
import NotFound from './pages/NotFound/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/:section"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/section/:sectionId"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
