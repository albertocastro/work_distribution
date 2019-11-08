const Sequelize = require('sequelize');


const sequelize = new Sequelize('mysql://root:work_distribution_pass@mysql:3309/work_distribution',{ logging: false});
module.exports = sequelize
