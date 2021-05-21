# Task-Bot

## introduction
This is a bot which can be intergrated to the slack group. This bot can gather some information about the tasks that group members done on a day, and then send them to a particular email at 5 pm on the day

## How to use
To use that you need to add this bot to your slack group

* first a memebr need to call bot using `Hello @TaskBot`
* then seperate thread will be opened
* Then memeber should provide answers to the questions which will be asked by task bot
* Then finally bot will ask `Do you need to add another task?`
* If member need that, memeber should type yes or otherwise no
* then TaskBot will show all the tasks that memeber entered up to that time

## Development Guide

**Prerequests**
* Serverless framework
* NodeJS/ ExpressJS
* AWS

**Steps**
First clone the project and install dependencies 
```
npm install
```
Then create aws-node serverless project using serverless framework
```
serverless create --template aws-nodejs --path taskbot
```
Then create a new app in serverless framework and give Iam role
Then configure service, app and org in serverless.yml file according to your new app
Then create a new app in slack API
Then set following scopes
```
app_mentions:read
channels:history
chat:write
users.profile:read
users:read
```
Then Install the app to workspace
Then collect Bot User OAuth Token and Verification Token
Then set those tokens to parameters section of app of serverless
finally deploy the app
```
sls deploy
```




