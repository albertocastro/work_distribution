const Sequelize = require('sequelize');
const sequelize = require("../db")

class Agent extends Sequelize.Model{

 
}
Agent.init({
    // attributes
  firstName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true

    // allowNull defaults to true
  },
  timeTaskTaken: {
    type: Sequelize.DATE,
    allowNull: true

    // allowNull defaults to true
  }
}, {
    sequelize,
    modelName: 'agent'
    // options
  })
class Task extends Sequelize.Model{


}
Task.init({
    // attributes
  priority: {
    type: Sequelize.INTEGER  ,
    allowNull: true

},
  summary: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  completed:{
      type: Sequelize.BOOLEAN,
      defaultValue:false
  }
}, {
    sequelize,
    modelName: 'task'
    // options
  })

class Skill extends Sequelize.Model{

 
}
Skill.init({
    // attributes
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true
  }
}, {
    sequelize,
    modelName: 'skill'
    // options
  })

  Agent.belongsToMany(Skill,{through:"AgentSkill"})
  Task.hasOne(Agent)
  Skill.belongsToMany(Agent,{through:"AgentSkill"})
  Skill.belongsToMany(Task,{through:"TaskSkill"})
  Task.belongsToMany(Skill,{through:"TaskSkill"});
  // Agent.belongsToMany(Skill,{through:"AgentSkill"})
  




  exports.promiseSequelize =  sequelize.sync()


exports.Agent = Agent
exports.Task = Task
exports.Skill = Skill
exports.sequelize = sequelize
exports.TASK_PRIORITY = {HIGH:1,LOW:0}