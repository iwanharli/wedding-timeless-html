import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './components/PublicSite'
import Login from './edit/Login'
import RequireAuth from './edit/RequireAuth'
import Editor from './edit/Editor'
import NotFound from './NotFound'

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
