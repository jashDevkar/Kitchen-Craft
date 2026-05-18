
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ModularKitchenWebsite from './pages/HomePage'

import AddSection from './pages/AddSection'
import AddContent from './pages/AddContent'
import Layout from './pages/Layout'
import ViewAll from './pages/ViewAll'
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

function App() {


  return (
    <>
      <Routes>

        <Route path='/' element={<ModularKitchenWebsite />} />
        <Route path='/view-all' element={<ViewAll />} />

        <Route element={<Layout/>}>

          <Route path='add/' element={<AddSection />} />

          <Route path='section/:name' element={<AddContent />} />
        </Route>


      </Routes>
    </>
  )
}

export default App
