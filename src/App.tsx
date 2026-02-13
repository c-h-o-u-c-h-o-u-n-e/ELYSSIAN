import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <div className="container">
        <h1>Bienvenue sur votre application</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Compteur: {count}
          </button>
        </div>
        <p className="description">
          Commencez par modifier <code>src/App.tsx</code>
        </p>
      </div>
    </div>
  )
}

export default App
