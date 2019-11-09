const Sequelize = require('sequelize');
const sequelize = require("../db")
class Agent extends Sequelize.Model {}
Agent.init({
  firstName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true

  },
  timeTaskTaken: {
    type: Sequelize.DATE,
    allowNull: true

  }
}, {
  sequelize,
  modelName: 'agent'
})
module.exports = Agent




