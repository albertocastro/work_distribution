const Sequelize = require('sequelize');
const sequelize = require("../db")

class Task extends Sequelize.Model {}
Task.init({
  priority: {
    type: Sequelize.INTEGER,
    allowNull: true

  },
  summary: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'task'
})

module.exports = Task