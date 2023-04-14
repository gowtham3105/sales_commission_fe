import React, { Component, useState, useEffect } from 'react';
import './AddSalesPage.css';
import { AddSales } from '../../api/api';

export const AddSalesPage = () => {
	const [data, setData] = useState({});
	const handleFileUpload = (event) => {
		if (event.target.files.length === 0) {
			return;
		}

		if (event.target.files.length === 1) {
			const fileReader = new FileReader();

			fileReader.readAsText(event.target.files[0], 'UTF-8');
			fileReader.onload = async (event) => {
				const contents = JSON.parse(event.target.result);

				if (validData(contents)) {
					setData(contents);
					// var res = await AddSales(contents);

					// if (res) {
					// 	alert('Sales added successfully');
					// } else {
					// 	alert('Error adding sales');
					// }
				} else {
					alert("File doesn't contain both product and salesmen details");
				}
			};
			return;
		}

		const readers = [];

		for (let i = 0; i < event.target.files.length; i++) {
			const fileReader = new FileReader();

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

		Promise.all(readers).then(async (values) => {
			console.log(values, 'values');
			const result = values.reduce((acc, cur) => {
				const key = Object.keys(cur)[0];
				acc[key] = cur[key];
				return acc;
			}, {});

			console.log(result);
			setData(result);

			// var res = await AddSales(result);

			// if (res) {
			// 	alert('Sales added successfully');
			// } else {
			// 	alert('Error adding sales');
			// }
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
				alert('Sales added successfully');
			} else {
				alert('Error adding sales');
			}
		});
	};

	return (
		<div>
			<h1>Add Sales</h1>

			<div>
				<input type='file' onChange={handleFileUpload} multiple />
				{data && <div>{JSON.stringify(data)}</div>}
				<br />
				<div>
					<button onClick={handleAddSales}>Add</button>
				</div>
			</div>
		</div>
	);
};
