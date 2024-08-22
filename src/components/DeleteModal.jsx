import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50'>
			<div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full'>
				<h2 className='text-2xl font-semibold mb-4 text-gray-800'>
					Confirm Deletion
				</h2>
				<p className='text-gray-600 mb-6'>
					Are you sure you want to delete this dispute? This action cannot be
					undone.
				</p>
				<div className='flex justify-end space-x-4'>
					<button
						onClick={onClose}
						className='bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition duration-150'
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className='bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition duration-150'
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
