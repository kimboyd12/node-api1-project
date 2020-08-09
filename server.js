const express = require("express")

const db = require("./database");
const shortid = require("shortid");

// creates new express server
const server = express()
// middleware
server.use(express.json())

// POST request
server.post("/api/users", (req, res) => {

    if(req.body.name && req.body.bio) {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio
        })

        const users = db.getUsers()
        if (users) {
        res.status(201).json(newUser)

    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for user."})}
    
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database"}) }
    })


// GET request
server.get("/api/users", (req, res) => {
    const users = db.getUsers()
    
    if(users) {
        res.json(users)
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
})


// GET request to /api/users/:id
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    if (user) {
        try { 
          res.json(user) 
        } catch(error) {
            res.status(500).json({ errorMessage: "The user information could not be retrieved." })}
        } else {
        res.status(404).json({ message: "The user with the specified ID does not exist" })}  
    })


// DELETE request
server.delete("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)

    if (user) {
        try {
            db.deleteUser(req.params.id)
            res.status(200).json(user)
        } catch(error) {
            res.status(500).json({ errorMessage: "The user could not be removed" })}
    } else {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist" })
    }
})

// PUT request to /api/users/:id
server.put("/api/users/:id", (req, res) => {
    try {
        const user = db.getUserById(req.params.id)

        if (!req.body.name || !req.body.bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user" })
        } else if (!user) {
            res.status(400).json({ message: "The user with the specified ID does not exist." })
        } else {
            db.updateUser(req.params.id, {
                name: req.body.name,
                bio: req.body.bio
            })
            res.status(200).json(user)
        }
    } catch(error) {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
})



server.listen(8080, () => {
    console.log("Server listening on port 8080")
})

