import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import "./Login.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="login"/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;