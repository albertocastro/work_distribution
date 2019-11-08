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
    const WorkManager = require("../business/WorkManager")
    const TASK_PRIORITY = require("../models/Agent").TASK_PRIORITY

    let createdAgent = { firstName: "Alberto" }

    // describe('Create Agent', function () {
    //     it('Should create an Agent', async function () {
    //         const createdAgentId = await WorkManager.createAgent(createdAgent)
    //         createdAgent.id = createdAgentId
    //         return createdAgent.id

    //     });
    //     it('Should create an Agent with Skills', async function () {
    //         let agentWithSkills = {
    //             firstName: "El bueno",
    //             skills: ["test", "php", "newone", "skill2", "skill1", "my new skill"],
    //         }

    //         const createdAgentId = await WorkManager.createAgentWithSkill(agentWithSkills)
    //         createdAgent.id = createdAgentId
    //         return createdAgent.id

    //     });
    //     it('Should create another Agent with Skills', async function () {
    //         let agentWithSkills = {
    //             firstName: "juan",
    //             lastName: "Castro",
    //             skills: ["javascript", "drupal", "docker", "php"],
    //         }

    //         const createdAgentId = await WorkManager.createAgentWithSkill(agentWithSkills)
    //         createdAgent.id = createdAgentId
    //         return createdAgent.id

    //     });
    // });

    // describe('Get Agent', function () {
    //     it(`Should find an Agent with the name ${createdAgent.firstName}`, async function () {
    //         const agent = await WorkManager.getAgent({ firstName: createdAgent.firstName })
    //         return assert(agent.id)
    //         //    return createdAgent.id

    //     });
    // });

    // describe('Update Agent', function () {
    //     it('Should update an Agent', async function () {
    //         await WorkManager.updateAgent({ lastName: "Castro" }, { firstName: "Alberto" })
    //         const agent = await WorkManager.getAgent({ firstName: "Alberto", lastName: "Castro" })
    //         return assert(agent.id)
    //     });
    // });
    // describe('Delete Agent', function () {
    //     it('Should delete agent Alberto', async function () {
    //         await WorkManager.deleteAgent({ firstName: "Alberto" })
    //         const agent = await WorkManager.getAgent({ firstName: "Alberto" })

    //         return assert(!agent)
    //     });
    // });
describe("Tasks", function () {
    let createdTask
    const taskName = "Deploy to production"
    const Task = require("../models/Agent").Task
    const TASK_PRIORITY = require("../models/Agent").TASK_PRIORITY

    const WorkManager = require("../business/WorkManager")

    this.beforeEach(async function(){
        const {sequelize} = require("../models/Agent")
        await WorkManager.cleanDB()
    })

    
    it(`Should create 2 users and return the first one because has all the skills`, async function () {

        const sequelize = require("../models/Agent").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/Agent")

       

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
        const { Agent, Task, promiseSequelize } = require("../models/Agent")



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

        const sequelize = require("../models/Agent").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/Agent")

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

        const sequelize = require("../models/Agent").sequelize
        const { Agent, Task, promiseSequelize } = require("../models/Agent")

        await promiseSequelize

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

