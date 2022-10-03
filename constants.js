const hash = {
  SALT: 'e-commerce-app-salt',
  ITERATIONS: 2000,
  KEY_LEN: 64,
  DIGEST: 'sha512',
};

const tokenExpiration = 60 * 5;

const applianceTypeEnum = ['low-power', 'mid-power', 'high-power'];

module.exports = { hash, tokenExpiration, applianceTypeEnum };
