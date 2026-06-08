import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './components/PublicSite'
import Login from './edit/Login'
import RequireAuth from './edit/RequireAuth'
import Editor from './edit/Editor'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/edit/login" element={<Login />} />
        <Route
          path="/edit"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        <Route
          path="/edit/:section"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
