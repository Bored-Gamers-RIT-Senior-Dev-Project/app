import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routes } from './routes.jsx';
import { RouterProvider } from 'react-router';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={routes} />
	</StrictMode>
);
