// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState("");

	// const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setUser({ token });
		}
	}, []);

	const login = (token) => {
		localStorage.setItem("token", token);
		setUser(token);
		// navigate("/dashboard");
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		// navigate("/");
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		// console.log(token);
		setUser(token);
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
