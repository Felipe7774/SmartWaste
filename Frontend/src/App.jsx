import { useState } from 'react'
import './App.css'
import Navbar from "./components/navbar";
import Home from './pages/Home';
import Classifier from './pages/Classifier';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Home />
      <Classifier />
    </>
  )
}
export default App
