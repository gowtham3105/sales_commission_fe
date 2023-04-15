import React, { useState } from 'react';
import './AddSalesPage.css';
import { AddSales } from '../../api/api';
import { Button } from '@mui/material';
import { JsonViewer } from '@textea/json-viewer';
import Swal from 'sweetalert2';

export const AddSalesPage = () => {
	const [data, setData] = useState(null);
	const [fileName, setFileName] = useState('');
	const handleFileUpload = (event) => {
		if (event.target.files.length === 0) {
			return;
		}

		if (event.target.files.length === 1) {
			const fileReader = new FileReader();
			// get file name
			setFileName(event.target.files[0].name);

			fileReader.readAsText(event.target.files[0], 'UTF-8');
			fileReader.onload = async (event) => {
				const contents = JSON.parse(event.target.result);
				if (validData(contents)) {
					setData(contents);
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: "File doesn't contain both product and salesmen details",
					});
				}
			};
			return;
		}

		const readers = [];
		// get file names by joining all file names
		const fileNames = [];

		for (let i = 0; i < event.target.files.length; i++) {
			const fileReader = new FileReader();
			fileNames.push(event.target.files[i].name);

			fileReader.readAsText(event.target.files[i], 'UTF-8');
			const promise = new Promise((resolve) => {
				fileReader.onload = (event) => {
					const contents = JSON.parse(event.target.result);
					if (isProduct(contents)) {
						return resolve({ product: contents });
					} else {
						return resolve({ salesman: contents });
					}
				};
			});

			readers.push(promise);
		}

		setFileName(fileNames.join(', '));

		Promise.all(readers).then(async (values) => {
			const result = values.reduce((acc, cur) => {
				const key = Object.keys(cur)[0];
				acc[key] = cur[key];
				return acc;
			}, {});

			if (validData(result)) {
				setData(result);
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: "File doesn't contain both product and salesmen details",
				});
			}
		});
	};

	const isProduct = (data) => {
		const fieldNames = Object.keys(data[0]);

		if (fieldNames.includes('product_name')) {
			return true;
		}

		return false;
	};

	const validData = (data) => {
		const fieldNames = Object.keys(data);

		if (fieldNames.includes('product') && fieldNames.includes('salesman')) {
			return true;
		}

		return false;
	};

	const handleAddSales = () => {
		return AddSales(data).then((res) => {
			if (res) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Sales added successfully',
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Something went wrong',
				});
			}
		});
	};

	return (
		<div>
			<h1>Add Sales</h1>

			<div>
				<label htmlFor='file-upload' className='custom-file-upload'>
					Choose File
				</label>

				<input
					id='file-upload'
					type='file'
					onChange={handleFileUpload}
					multiple
					accept='application/JSON'
					hidden
				/>

				<br />
				{fileName ? <div>File Names: {fileName}</div> : 'No file selected'}
				<br />
				<div>
					<Button onClick={handleAddSales} variant='contained'>
						Add
					</Button>
				</div>
				<br />
				{data && <JsonViewer value={data} />}

				{/* {data && <div>{JSON.stringify(data)}</div>} */}
			</div>
		</div>
	);
};
