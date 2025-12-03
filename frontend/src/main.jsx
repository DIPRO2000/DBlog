import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import { BrowserRouter } from 'react-router-dom'

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient()

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </BrowserRouter>
// )
