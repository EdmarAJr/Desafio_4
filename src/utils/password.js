const bcrypt = require('bcryptjs');

const check = async (senha, hash) => {
	const comparison = await bcrypt.compare(senha, hash);
	return comparison;
};

const encrypt = async (senha) => {
	const hash = await bcrypt.hash(senha, 10);
	return hash;
};

module.exports = { check, encrypt };
