import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Hello Vite + React!</h1>
      <p>
        <Button onClick={() => setCount((count) => count + 1)}>count is: {count}</Button>
      </p>
      <p>
        Edit <code>App.tsx</code> and save to test HMR updates.
      </p>
    </div>
  )
}

export default App
