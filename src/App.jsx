import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { Inserir } from './pages/Inserir'
import { Editar } from './pages/Editar'

export default function App() {
 
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/inserir" element={<Inserir />} />
      <Route path="/editar/:id" element={<Editar />} />
    </Routes>
  )
}