import React from 'react';
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function Login() {
    const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  if (username === "jmunguia@lizethexpress.com" && password === "12345") {
    navigate("/home"); // redirige a Home
  } else {
    alert("Credenciales incorrectas");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white to-Secondbg font-sans px-4">
      <div className="bg-white rounded-3xl shadow-lg flex w-full max-w-5xl overflow-hidden">
        {/* Lado izquierdo - Bienvenida */}
        
        <div className="hidden md:flex w-1/2 bg-gradient-to-b from-bglw1 to-bglw2 text-white p-10 flex-col justify-center relative">
        <img src={logo} alt="Lizeth Express Logo" className="w-25 h-25 object-contain ag-center-cols-container" />
          <h2 className="text-4xl font-bold mb-2 text-center">WELCOME</h2>
          <p className="uppercase tracking-wider text-center text-sm mb-4">Lizeth Express Software</p>
          <p className="text-sm leading-relaxed">
          This portal is designed exclusively for Lizeth Express employees.
          <p className= "font-bold mb-2">To get started:</p>
            <p>1. Enter your assigned username and password.</p>
            <p>2. Access the modules enabled for your profile.</p>
            <p> 3. Manage your tasks in an organized and secure way.</p>
            <p>If you experience any issues accessing the system, please contact internal technical support.</p>
          </p>
          {/* Círculos decorativos */}
         {/* <div className="absolute -bottom-14 -left-12 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-8 left-09 w-20 h-30 bg-white opacity-20 rounded-full"></div>*/}
        </div>
        {/* Lado derecho - Formulario */}
        <div className="w-full md:w-1/2 p-10">
        <div className="flex flex-col items-center mb-6">
  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  </div>
  <h2 className="text-3xl font-bold text-darkText">Sign in</h2>
</div>



          <p className="text-sm text-gray-500 mb-6">Please enter your credentials</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                name="username"
                type="text"
                placeholder="lizeth.express@lizethexpress.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                   name="password"
                   type="password"
                   placeholder="*********"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary hover:underline"
                >
                  SHOW
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-secondary hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
