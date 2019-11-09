var assert = require('assert');

describe('Database', function () {
    describe('Connection', function () {
        it('Should connect correctly to the database', function (done) {
            const sequelize = require("../db.js")
            sequelize
                .authenticate()
                .then(() => {
                    done();
                })
                .catch(err => {
                    console.error('Unable to connect to the database:', err);
                });
        });
    });
});
describe('WorkManager', function () {


describe("Tasks", function () {
    let createdTask
    const taskName = "Deploy to production"
    const Task = require("../models/").Task
    const TASK_PRIORITY = require("../models/").TASK_PRIORITY

    const WorkManager = require("../business/WorkManager")

    this.beforeEach(async function(){
        const {sequelize} = require("../models/")
        await WorkManager.cleanDB()
    })

    
    it(`Should create 2 users and return the first one because has all the skills`, async function () {

        const sequelize = require("../models/").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/")       

        let agent1 = {
            firstName: "Good Match",
            skills: ["php", "wordpress"],
        }
        let agent2 = {
            firstName: "bad Match",
            skills: ["ruby", "rails"],
        }
    
        const agent1Id = (await WorkManager.createAgentWithSkill(agent1)).id
        const agent2Id = (await WorkManager.createAgentWithSkill(agent2)).id

        const taskId = (await WorkManager.createTask({
            summary: taskName,
            priority: TASK_PRIORITY.LOW,
            skills: ["php", "wordpress"]
        })).id


        let result = await WorkManager.assignAgent(taskId)
        assert(result.assignee.id == agent1Id)
        assert(result.assignee.id != agent2Id)

    })
    it(`Should not select the agent because is working in something else`, async function () {

        const sequelize = require("../models/Agent").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/")



        const taskId = (await WorkManager.createTask({
            summary: "First Task",
            priority: TASK_PRIORITY.HIGH,
            skills: ["php", "wordpress"]
        })).id

        let agent1 = {
            firstName: "First User",
            skills: ["php", "wordpress"],
        }
       
        const agentId = (await WorkManager.createAgentWithSkill(agent1)).id
        await WorkManager.assignAgent(taskId)
        
        // At this point user is assigned and shouldn't take lower tasks
        const lowerTaskId = (await WorkManager.createTask({
            summary: "Second Task",
            priority: TASK_PRIORITY.LOW,
            skills: ["php", "wordpress"]
        })).id

       const result =  await WorkManager.assignAgent(lowerTaskId)

       assert(result.error_type== 3)

    })
    it(`Should prefer agent not assigned`, async function () {

        const sequelize = require("../models/").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/")

        await promiseSequelize

        const task1Id = (await WorkManager.createTask({
            summary: "First Task",
            priority: TASK_PRIORITY.HIGH,
            skills: ["php", "wordpress"]
        })).id
        const task2Id = (await WorkManager.createTask({
            summary: "Second Task",
            priority: TASK_PRIORITY.HIGH,
            skills: ["php", "wordpress"]
        })).id
        let agent1 = {
            firstName: "First User",
            skills: ["php", "wordpress"],
        }
        let agent2 = {
            firstName: "Second User",
            skills: ["php", "wordpress"],
        }
        const agent1Id = (await WorkManager.createAgentWithSkill(agent1)).id
        const agent2Id = (await WorkManager.createAgentWithSkill(agent2)).id

        await WorkManager.assignAgent(task1Id)
        
       
       const result =  await WorkManager.assignAgent(task2Id)
        
       assert(result.assignee.id == agent2Id)

    })
    it(`If all are in low priority, should choose the one that took the task most recently`, async function () {

        const sequelize = require("../models/").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/")


        const task1Id = (await WorkManager.createTask({
            summary: "First Task",
            priority: TASK_PRIORITY.LOW,
            skills: ["php", "wordpress"]
        })).id
        const task2Id = (await WorkManager.createTask({
            summary: "Second Task",
            priority: TASK_PRIORITY.LOW,
            skills: ["php", "wordpress"]
        })).id
        const task3Id = (await WorkManager.createTask({
            summary: "Third Task",
            priority: TASK_PRIORITY.LOW,
            skills: ["php", "wordpress"]
        })).id
        const task4Id = (await WorkManager.createTask({
            summary: "Forth Task",
            priority: TASK_PRIORITY.LOW,
            skills: ["php", "wordpress"]
        })).id
        let agent1 = {
            firstName: "First User",
            skills: ["php", "wordpress"],
        }
        let agent2 = {
            firstName: "Second User",
            skills: ["php", "wordpress"],
        }
        let agent3 = {
            firstName: "Third User",
            skills: ["php", "wordpress"],
        }
        const agent1Id = (await WorkManager.createAgentWithSkill(agent1)).id
        const agent2Id = (await WorkManager.createAgentWithSkill(agent2)).id
        const agent3Id = (await WorkManager.createAgentWithSkill(agent3)).id
        await WorkManager.assignAgent(task1Id)
        await WorkManager.assignAgent(task2Id)
        await WorkManager.assignAgent(task3Id)
        const result =  await WorkManager.assignAgent(task4Id)

        
        assert(result.assignee.id == agent1Id)

    })
})
})

