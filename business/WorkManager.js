const Agent = require("../models/Agent").Agent
const Task = require("../models/Agent").Task
const Skill = require("../models/Agent").Skill
const sequelize = require("../models/Agent").sequelize

const Sequelize = require('sequelize');

const Op = Sequelize.Op
const TASK_PRIORITY = require("../models/Agent").TASK_PRIORITY

class WorkManager{
    static async init(){
        let agent1 = {
            firstName: "First User",
            skills: ["skill1","skill2","skill3"]
        }
        let agent2 = {
            firstName: "Second User",
            skills: ["skill1","skill2"]
        }
        await this.cleanDB()

        await WorkManager.createAgentWithSkill(agent1)
        await WorkManager.createAgentWithSkill(agent2)
    }
    static async createAgent(agentParams){
        const agent = await Agent.create(agentParams)
        return agent.id

    }
    static async updateAgent(agentParams,whereParams){
        await Agent.update(agentParams,{where:whereParams})

    }
    static async getAgent(where){
        const res = await Agent.findAll({where})
        return res[0]

    }
    static async deleteAgent(where){
      await Agent.destroy({where})

    }
    static async createAgentWithSkill(agent){

        // First we need to create all the skills that are not already there

        // Existing Skills
        let skillsIds=[]
        for(let i=0;i<agent.skills.length;i++){
            let skill = agent.skills[i]
            let dbSkill = await Skill.findOrCreate({
                raw: true,
                where:{
                    name:skill
                    
                }
                
            })
            skillsIds.push(dbSkill[0].id)
        }
        delete agent.skills
        let agentFromDb =  await Agent.create(agent)
        agentFromDb.setSkills(skillsIds)
      
        let response = agentFromDb.get({plain:true})
        const skills = await agentFromDb.getSkills({raw:true})
        response.skills = skills
        return response
  
      }
    static async createTask(task){

        // First we need to create all the skills that are not already there

        // Existing Skills
        let skillsIds=[]
        for(let i=0;i<task.skills.length;i++){
            let skill = task.skills[i]
            let dbSkill = await Skill.findOrCreate({
                raw: true,
                where:{
                    name:skill
                    
                }
                
            })
            skillsIds.push(dbSkill[0].id)
        }
    
        let taskFromDB =  await Task.create(task)
        taskFromDB.setSkills(skillsIds)
   
        let response = taskFromDB.get({plain:true})
        const skills = await taskFromDB.getSkills({raw:true})
        response.skills = skills
        return response
  
      }
      static async markCompleted(taskId){
          await Task.update({completed:1},{where:{id:taskId}})
          let agent = await Agent.update({taskId:null},{where:{taskId}})
          return (agent>0)
      }
      static async assignAgent(taskId){
          // Getting task 
          let task = await Task.findOne({where:{id:taskId}})
          if(!task) return {error_type:2,error_message:"Task not found"}
          let skillsOfTask = await task.getSkills({raw:true}).map(skill=>skill.id)
           const skillsAsString = skillsOfTask.join(",")
          // Getting all agents with those skills
         const query =`
            SELECT agents.* from agents 
            join AgentSkill on agents.id = AgentSkill.agentId
            join skills on skills.id = AgentSkill.skillId
        where skills.id in (${skillsAsString})
        group by agents.id
            HAVING COUNT(DISTINCT skills.id) = ${skillsOfTask.length};
        `
       const agentWithSkills = await sequelize.query(query,{model: Agent,type: sequelize.QueryTypes.SELECT})

        if(agentWithSkills.length == 0) return {error_type:1,error_message:"There are no agents with all the skills"}

        // now discarting per priority of tasks
        // We will evaluate likeliness of a candidate to be picked  
        // lower the number, more likely
    
        let agentSelection = agentWithSkills.map(async agent=>{
            
            let currentTask = await Task.findOne({where:{id:agent.taskId}})
            // Task == null means we can assign him
            if(currentTask==null) {
                return {agent,likeliness:1}
            }else
            if( currentTask.priority == TASK_PRIORITY.LOW ) {
                return {agent,likeliness:2}
            }else
            if(task.priority > currentTask.priority ) {
                return {agent,likeliness:3}
            }else{
                return {agent,likeliness:-1}

            }

        })
        agentSelection = await Promise.all(agentSelection)
       
        // If all elements have a likeliness of 2 (means all are working in low priority)  it should choose the one that took it most recently
     
        let assignee 
        
        if(agentSelection.every(elem=>elem.likeliness==2)){
            assignee = agentSelection.sort(function(a,b) { 
                return new Date(b.timeTaskTaken).getTime() - new Date(a.timeTaskTaken).getTime() 
            })[0].agent
            
        }else{

            const filteredList = agentSelection.filter(a=>a.likeliness>0).sort((a,b)=> a.likeliness>b.likeliness )
            assignee = (filteredList.length>0)?filteredList[0].agent.get({plain:true}) : null
        }


        if(!assignee) return {error_type:3,error_message:"There is no agent available"}
       
        delete assignee.taskId
        await Agent.update({taskId:task.id,timeTaskTaken:new Date()},{where:{id:assignee.id}})
        
        const response =  {...task.get({plain:true}),assignee}

        return response

      }
      static async cleanDB(){
        await sequelize.query("delete from AgentSkill ")
        await sequelize.query("delete from TaskSkill ")
        await sequelize.query("delete from skills ")
        await sequelize.query("delete from tasks ")
        await sequelize.query("delete from agents")
        return Promise.resolve()

      }

}


    WorkManager.init()


module.exports =  WorkManager 