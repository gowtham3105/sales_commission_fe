import React, { Component, useState, useEffect } from 'react';
import './AddSalesPage.css';
import { AddSales } from '../../api/api';

export const AddSalesPage = () => {
	const [data, setData] = useState({});
	const handleFileUpload = (event) => {
		if (event.target.files.length === 0) {
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
			const result = values.reduce((acc, cur) => {
				const key = Object.keys(cur)[0];
				acc[key] = cur[key];
				return acc;
			}, {});

			setData(result);

			var res = await AddSales(result);

			if (res) {
				alert('Sales added successfully');
			} else {
				alert('Error adding sales');
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

	return (
		<div>
			<h1>Add Sales</h1>

			<div>
				<input type='file' onChange={handleFileUpload} multiple />
				{data && <div>{JSON.stringify(data)}</div>}
			</div>
		</div>
	);
};
