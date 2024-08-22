import React from "react";

const UserDeleteModal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  p-10'>
			<div className='bg-white p-4 rounded'>
				<h2 className='mb-10'>Are you sure you want to delete this user?</h2>
				<div className='flex justify-end mt-4'>
					<button onClick={onClose} className='mr-2'>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className='bg-red-500 text-white py-1 px-4 rounded'
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserDeleteModal;
