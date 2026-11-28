import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SiteContentProvider } from './siteContent';
import './index.css';

createRoot(document.getElementById('root')!).render(<SiteContentProvider><App /></SiteContentProvider>);
