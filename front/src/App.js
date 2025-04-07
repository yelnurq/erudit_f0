import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from './pages/Auth/User/Login';
import AdminLogin from './pages/Auth/Admin/Login';
import Register from './pages/Auth/User/Register';
import AdminPanel from './pages/AdminPanel/AdminPanel';

import Questions from './pages/AdminPanel/Questions/Questions';
import AllUsers from './pages/AdminPanel/AllUsers/AllUsers';
import RatingsAdmin from './pages/AdminPanel/Ratings';
import Students from './pages/AdminPanel/Students';

import OlympiadQuiz from './pages/Quiz/Quiz';
import UserScores from './pages/UserPanel/Score/UserScores';
import Home from './pages/HomePage/Home';
import Profile from './pages/UserPanel/Profile/Profile';
import EditProfile from './pages/UserPanel/Profile/EditProfile';
import Ratings from "./pages/UserPanel/Ratings/Ratings";
import Leader from "./pages/UserPanel/Leaders/Leader";
import CheckDocumentNumber from "./pages/UserPanel/CheckDocument/CheckDocumentNumber";
import AllScore from "./pages/UserPanel/AllScore/AllScore";
import Terms from "./pages/UserPanel/Terms/Terms";



const ProtectedRoute = ({ children, tokenKey, redirectTo }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (token && isAuthenticated !== true) {
      setIsAuthenticated(true);
    } else if (!token && isAuthenticated !== false) {
      setIsAuthenticated(false); 
    }
  }, [tokenKey, isAuthenticated]); 
  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />; 
  }

  return children; 
};


function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/leaders" element={<Leader />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/check-document" element={<CheckDocumentNumber />} />

          {/* Маршруты для пользователей */}
          <Route path="/auth/login" element={<Login/>} />
          <Route path="/auth/register" element={<Register/>} />

          {/* Защищённый маршрут для админов */}

          <Route 
            path="/admin/" 
            element={(
              <ProtectedRoute tokenKey="token_admin" redirectTo="/auth/admin">
                <Questions />
              </ProtectedRoute>
            )}
          />
          <Route 
            path="/admin/users" 
            element={(
              <ProtectedRoute tokenKey="token_admin" redirectTo="/auth/admin">
                <AllUsers />
              </ProtectedRoute>
            )}
          />
          <Route 
            path="/admin/ratings" 
            element={(
              <ProtectedRoute tokenKey="token_admin" redirectTo="/auth/admin">
                <RatingsAdmin />
              </ProtectedRoute>
            )}
          />
          <Route 
            path="/admin/students" 
            element={(
              <ProtectedRoute tokenKey="token_admin" redirectTo="/auth/admin">
                <Students />
              </ProtectedRoute>
            )}
          />

          {/* Маршрут для Олимпиады, защищённый маршрутом для обычных пользователей */}
          <Route path="/quiz" element={(
            <ProtectedRoute tokenKey="token" redirectTo="/auth/login">
              <OlympiadQuiz />
            </ProtectedRoute>
          )} />

          <Route path="/profile" element={(
            <ProtectedRoute tokenKey="token" redirectTo="/auth/login">
              <Profile />
            </ProtectedRoute>
          )} />


          <Route path="/userscores" element={(
            <ProtectedRoute tokenKey="token" redirectTo="/auth/login">
              <AllScore />
            </ProtectedRoute>
          )} />

          {/* Если админ уже авторизован, сразу перенаправляем на /admin */}
          <Route path="/auth/admin" element={<AdminLogin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
