import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from '../Context/SocketContext.jsx'    
import App from './App.jsx'
import './index.css'
import { StreamVideoProvider } from '@stream-io/video-react-sdk'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <SocketContextProvider>
        <StreamVideoProvider>
          <App />
        </StreamVideoProvider>
      </SocketContextProvider>
    </RecoilRoot>
  </StrictMode>,
)
