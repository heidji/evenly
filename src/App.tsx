import React, {useState} from 'react';
import './App.css';
import Loader from './components/loader';
import Cookies from 'js-cookie'
import Auth from "./pages/Auth";
import Main from "./pages/Main";

type Place = {
  thumbnail: string;
}

declare global {
  interface Window { auth: any; }
}

function App() {

  const [auth, setAuth] = useState<string>('');

  if(typeof Cookies.get('auth') == 'undefined'){
    return <Auth/>
  }else{
    window.auth = Cookies.get('auth');
    return <Main/>
  }


  return (
    <Loader/>
  );
}

export default App;
