
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ModularKitchenWebsite from './tem'
import Add from './pages/Add'
import AddSection from './pages/AddSection'
import Layout from './pages/Layout'

function App() {


  return (
    <>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<ModularKitchenWebsite />} />
          <Route path='/add'>
            <Route index element={<Add />} />
            <Route path='section' element={<AddSection />} />
          </Route>
        </Route>

      </Routes>
    </>
  )
}

export default App
