import './app.css'
import App from './App.svelte'
import "./locale/i18n";

const app = new App({
  target: document.getElementById('app')
})

export default app
