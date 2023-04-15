const API_ENDPOINT = 'http://localhost:8080/';

const AddSales = (data) => {
	return new Promise((myResolve, myReject) => {
		fetch(API_ENDPOINT + 'sales', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// mode: 'no-cors',
			body: JSON.stringify(data),
		})
			.then((result) => {
				if (result.status === 200) myResolve(true);
				else throw new Error('Error ' + result.status);
			})
			.catch((err) => {
				myReject(false);
			});
	});
};

const GetSales = (date) => {
	return new Promise((myResolve, myReject) => {
		fetch(API_ENDPOINT + 'sales/commission?date=' + date, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// mode: 'no-cors',
		})
			.then((result) => {
				if (result.status === 200) myResolve(result.json());
				else throw new Error('Error ' + result.status);
			})
			.catch((err) => {
				myReject(false);
			});
	});
}

export { AddSales, GetSales };
