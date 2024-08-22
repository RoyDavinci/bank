import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<ReactLoading type='spin' color='#007BFF' height={100} width={100} />
		</div>
	);
};

export default Loading;
