import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SiteContentProvider } from './siteContent';
import { registerPwa } from './pwa';
import './index.css';

createRoot(document.getElementById('root')!).render(<SiteContentProvider><App /></SiteContentProvider>);
registerPwa();
