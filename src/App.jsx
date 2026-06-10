import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './components/PublicSite'
import RequireAuth from './admin/auth/RequireAuth'
import NotFound from './pages/NotFound/NotFound'

const Login = lazy(() => import('./admin/auth/Login'))
const Editor = lazy(() => import('./admin/shell/Editor'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  )
}
