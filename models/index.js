const sequelize = require("../db")
const Agent = require("./Agent")
const Task = require("./Task")
const Skill = require("./Skill")
const Sequelize = require('sequelize');

Agent.belongsToMany(Skill, { through: "AgentSkill" })
Task.hasOne(Agent)
Agent.belongsTo(Task)
Skill.belongsToMany(Agent, { through: "AgentSkill" })
Skill.belongsToMany(Task, { through: "TaskSkill" })
Task.belongsToMany(Skill, { through: "TaskSkill" });

exports.promiseSequelize = sequelize.sync()


exports.Agent = Agent
exports.Task = Task
exports.Skill = Skill
exports.sequelize = sequelize
exports.TASK_PRIORITY = { HIGH: 1, LOW: 0 }