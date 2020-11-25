const bcrypt = require('bcryptjs');

const check = async (passsword, hash) => {
	const comparison = await bcrypt.compare(passsword, hash);
	return comparison;
};

const encrypt = async (password) => {
	const hash = await bcrypt.hash(password, 10);
	return hash;
};

module.exports = { check, encrypt };
