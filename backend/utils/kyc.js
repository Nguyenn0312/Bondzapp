const axios = require("axios");
const uuidv4 = require("uuid").v4;
const config = require("../config");

async function kyc(name, pan) {
	let headersList = {
		Accept: "*/*",
		"User-Agent": "Thunder Client (https://www.thunderclient.com)",
		"account-id": config.idfy.accountId,
		"api-key": config.idfy.apiKey,
		"Content-Type": "application/json",
	};

	let bodyContent = JSON.stringify({
		task_id: uuidv4(),
		group_id: uuidv4(),
		data: {
			id_number: pan,
		},
	});

	let reqOptions = {
		url: "https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_pan",
		method: "POST",
		headers: headersList,
		data: bodyContent,
	};

	let response = await axios.request(reqOptions);
	let requestId = response.data.request_id;

	await sleep(10000);

	reqOptions = {
		url: `https://eve.idfy.com/v3/tasks?request_id=${requestId}`,
		method: "GET",
		headers: headersList,
	};
	response = await axios.request(reqOptions);

	console.log(response.data);

	if (response.data[0].status != "completed") return false;

	const fname = response.data[0].result.source_output.first_name;

	if (name.toLowerCase().split(" ").includes(fname.toLowerCase()))
		return true;
	else return false;
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

module.exports = kyc;

// kyc("DURAISAMy Chavan", "BNZPM25011").then(console.log);