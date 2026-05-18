
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ModularKitchenWebsite from './tem'

import AddSection from './pages/AddSection'
import AddContent from './pages/AddContent'
import Layout from './pages/Layout'

function App() {


  return (
    <>
      <Routes>

        <Route path='/' element={<ModularKitchenWebsite />} />


        <Route element={<Layout/>}>

          <Route path='add/' element={<AddSection />} />

          <Route path='section/:name' element={<AddContent />} />
        </Route>


      </Routes>
    </>
  )
}

export default App
