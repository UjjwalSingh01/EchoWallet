import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeContextProvider } from "./theme/ThemeContextProvider.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
)
