module.exports = {
	port: 3000,
	mongo: "mongodb://localhost/waterline-sample",
	mysql: {
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'sms_service',
		port: 3306
	},
	statTableName: 'stat_day_results',
	ratioUserCount: 0.8,
};