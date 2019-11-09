# Work distribution service
work distribution service that can distribute tasks to agents.

## How to run
Just run start.sh. This should spin up two Docker containers. One for the database and one for the app. Database data is not persisted since this was a demo. In case needed, it's easy to add a Volume to that container

`$ ./start.sh`
## How to see 
Just go to http://localhost:3010

## Endpoints
- get: /createtask/
- get: /markcompleted/
- get: /addagent/
- get: /agents/

## Methods Definition
### /createtask/
Receives the properties of a Task, creates a Task and assigns an Agent to it.
Attributes of a Task:
- Summary (String)
- Priority (Int)
- Skills (Array)
```js
app.get('/createTask', async (req, res) =>{

    const { summary, priority,skills } = req.query

    const taskId = (await WorkManager.createTask({summary,priority,skills})).id
    const result = await WorkManager.assignAgent(taskId)
    res.send(result)
})
```
### /markcompleted/
Marks a task as completed and unassigns the Agent from that task
Attributes of a Task:
- Id (Int)

```js
app.get('/markcompleted', async (req, res) =>{

    const { id } = req.query
    const result = await WorkManager.markCompleted(id)
    res.send(result)
})
```
### /addagent/
> Plus work

Receives the attributes to create an Agent and creates it.

Attributes of an Agent:
- firstName (String)
- lastName (String)
- skills (Array of string)
```js
app.get('/addagent', async (req, res) =>{

    const { firstName, lastName,skills } = req.query
    const result = await WorkManager.createAgentWithSkill({
        firstName,lastName,skills
    })
    res.send(result)
})
```
### /agents/
> Plus work

Gets a list of all agents and their skills

```js
app.get('/agents', async (req, res) =>{

    const all = await WorkManager.getAllAgents()
    res.send(all)
})
```

# Unit Testing
Testing was done using Mocha.
## To Run
`$ npm test`