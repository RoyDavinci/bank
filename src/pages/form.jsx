import React from "react";

export const form = ({ formValues, handleChange }) => {
	return (
		<div>
			<form>
				<input type='text' name='firstname' />
				<input type='text' />
				<input
					type='email'
					name='lastname'
					onChange={(e) => handleChange(e)}
					value={formValues.lastname}
					required
				/>
				<button disabled></button>
			</form>
		</div>
	);
};
