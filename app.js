const express = require('express')
const app = express()
const port = process.env.PORT || 3002


const WorkManager = require("./business/WorkManager")


app.get('/createTask', async (req, res) =>{

    const { summary, priority,skills } = req.query

    const taskId = (await WorkManager.createTask({summary,priority,skills})).id
    const result = await WorkManager.assignAgent(taskId)
    res.send(result)
})
app.get('/markcompleted', async (req, res) =>{

    const { id } = req.query
    const result = await WorkManager.markCompleted(id)
    res.send(result)
})
app.get('/addagent', async (req, res) =>{

    const { firstName, lastName,skills } = req.query
    const result = await WorkManager.createAgentWithSkill({
        firstName,lastName,skills
    })
    res.send(result)
})

app.get('/agents', async (req, res) =>{

    const all = await WorkManager.getAllAgents()
    res.send(all)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
