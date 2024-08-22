// Error.jsx
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Error = ({ message }) => {
	React.useEffect(() => {
		toast.error(message, {
			position: toast.POSITION.TOP_CENTER,
			autoClose: 5000,
		});
	}, [message]);

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<div className='bg-red-500 text-white p-6 rounded shadow-lg'>
				<p>{message}</p>
				<ToastContainer />
			</div>
		</div>
	);
};

export default Error;
