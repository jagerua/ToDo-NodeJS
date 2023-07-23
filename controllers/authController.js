const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Role = require('../model/Role');
const Tasks = require('../model/Tasks');
const userToken = require('../model/userTokens');
const { registerValidation, loginValidation } = require('../helpers/validation');

class authController {
    async registration(req, res) {
        try {
            console.log();
            const { error } = registerValidation(req.body);
            if (error) return res.status(400).json({massage: error.details[0].message});

            const { name, email, password } = req.body;
            const candidate = await User.findOne({name});
            if (candidate) {
                return res.status(400).json({massage: 'User exists'});
            }

            const userRole = await Role.findOne({value: "USER"});
            const user = new User({name, email, password, roles: [userRole.value]});
            await user.save();
            res.json({code: 200, status: "Done", massage: 'User registration successful'});
        } catch(err) {
            console.log(err)
            res.status(400).json({massage: 'Registration error'});
        }
    }

    async login(req, res) {
        try {
            const { error } = loginValidation(req.body);
            if (error) return res.status(400).json({massage: 'We are here!'});

            const {email, password} = req.body;
            const user = await User.findOne({email});
            if (!user) return res.status(400).json({massage: `User ${email} is not found!`});
            
            if (password !== user.password) return res.status(400).json({massage: `Wrong password!`});

            const token = jwt.sign({ _id: user._id, name: user.name, role: user.roles }, process.env.TOKEN_SECRET, { expiresIn: '900000s' });
            console.log('Token: ', token);

            //Save Token in database
            // const DBToken = await userToken.findOne({email});
            const DBToken = await userToken.findOneAndUpdate({email}, { $set: { token: token } }, { upsert: true, new: true });
            // res.cookie('jwt', token, { httpOnly: true }); //{ maxAge: 24 * 60 *60 *1000} One day
            res.json({
                code: 200, 
                status: "Done",
                userData: {user},
                token: token
            });

        } catch(err) {
            res.status(400).json({massage: 'Login error'});
        }
    }

    async postTask(req, res) {
        const {user, title, done} = req.body;
        const task = new Tasks({user, title, done});
        await task.save();

        const tasks = await Tasks.findOne({user, title});
        
        try {
            console.log({tasks: tasks})
            res.status(200).json({code: 200, status: "Done", operation: "post", tasks: tasks});
        } catch(err) {
            console.log(err);
            res.status(400).json({
                message: "Error",
                err: err.message,
            })
        }
    }

    async updateTask(req, res) {
        const taskId = req.params.id;
        const data = req.body;

        const task = await Tasks.findOneAndUpdate({_id: taskId}, {title: data.title, done: data.done, updateDate: Date.now()});
        const updateed = await Tasks.findOne({_id: taskId});
        
        try {
            console.log({operation: "update", tasks: updateed})
            res.status(200).json({code: 200, status: "Done", operation: "update", task: updateed});
        } catch(err) {
            res.status(400).json({
                message: "Error",
                err: err,
            })
        }
    }

    async deleteTask(req, res) {
        const userIndex = (req.params.user).replace(/%20/i, ' ');
        const taskId = req.params.id;

        const task = await Tasks.findOneAndDelete({user: userIndex, _id: taskId});
        
        try {
            console.log({operation: "delete", tasks: task})
            res.status(200).json({code: 200, status: "Done", operation: "delete", task: task});
        } catch(err) {
            res.status(400).json({
                message: "Error",
                err: err,
            })
        }
    }

    async getUsers(req, res) {
            const users = await User.find();
        try {
            res.status(200).json({code: 200, status: "Done", operation: "show", users: users});
        } catch(err) {
            res.status(400).json({
                status: "Fail",
                message: "Error",
                err: err.message,
            })
        }
    }

    async getTasks(req, res) {
        const name = req.params.name;
        console.log(name);
        const tasks = await Tasks.find({user: name});
        try {
            res.status(200).json({status: '200', operation: "Data uploaded", UserTasks: tasks});
        } catch(err) {
            res.status(400).json({
                message: "Error",
                err: err.message,
            })
        }
    }

    async authUser(req, res) {
       try {
            // const DBToken = await userToken.findOne({token});
            res.json({'DBToken': 123})
        } catch(err) {
            res.status(400).json({status: "Fail", massage: `${err}`});
        } 
    }
}

module.exports = new authController();