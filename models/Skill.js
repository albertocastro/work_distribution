const Sequelize = require('sequelize');
const sequelize = require("../db")

class Skill extends Sequelize.Model {}
Skill.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'skill'
})
module.exports = Skill