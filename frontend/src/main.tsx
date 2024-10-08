import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import { ThemeContextProvider } from "./theme/ThemeContextProvider.tsx";
import store from './redux/store.ts';
import  { persistor }  from './redux/store.ts';
import { PersistGate } from "redux-persist/integration/react";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
)
