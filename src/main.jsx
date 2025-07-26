import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  RouterProvider,
} from "react-router";
import router from './rauter/rauter.jsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import { googleMapAPIKey } from './map-api-key.js';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={googleMapAPIKey}>
      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>,
)
