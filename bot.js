'use strict';

///import {getUserStep, setUserStep} from './UserSteps.js'
const BotUtils = require('./BotUtils')
const Slack = require('slack');
const token = "l2c89Qp8ARF6VM8m7kYSFg1J";
const bot_id = "U01LZ522N9J"

let thread = "";

module.exports.runbot = async (data) => {
    const dataObj = JSON.parse(data.body);
    //const dataObj = data.body;
    let response = {
        statusCode: 200,
        body: {},
        headers: { 'X-Slack-No-Retry': 1 }
    }
    console.log(dataObj)
    if ('bot_id' in dataObj.event) {
        response.body = JSON.stringify({ "msg": "msg send by bot" });
        return response;
    }
    

    try {
        console.log(('X-Slack-Retry-Num' in data.headers))
        if (!('X-Slack-Retry-Num' in data.headers)) {

            switch (dataObj.type) {
                case 'url_verification':
                    
                    response.body = JSON.stringify(await verifyCall(dataObj));
                    console.log(response)
                    break;

                case 'event_callback':
                    if(dataObj.event.text.split(' ')[0].toLowerCase()==="hello" && dataObj.event.type === 'app_mention'){
                        thread = dataObj.event.ts;
                        BotUtils.setUserStep(dataObj.event.user, 0);
                        const params = {
                            token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                            channel: dataObj.event.channel,
                            text: `Hello <@${dataObj.event.user}>, do you need to post your daily task? (yes/no)`,
                            thread_ts: dataObj.event.ts
                        }
    
                        await Slack.chat.postMessage(params);

                    } else {
                        let step = BotUtils.getUserStep(dataObj.event.user);
                        console.log("step "+ step)
                        if(step==0 ){
                            if(dataObj.event.text.toLowerCase()== "yes"){
                                const params = {
                                    token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                    channel: dataObj.event.channel,
                                    text: "What is the project name?",
                                    thread_ts: thread
                                }
                                
                                BotUtils.setUserStep(dataObj.event.user, 1);
                                await Slack.chat.postMessage(params);
        
                            } else if(dataObj.event.text.toLowerCase()== "no") {
                                

                                BotUtils.setUserStep(dataObj.event.user, 4);

                                let user_task_summary = BotUtils.getUserAllProjectData(dataObj.event.user)

                                const params1 = {
                                    token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                    channel: dataObj.event.channel,
                                    text: user_task_summary,
                                    thread_ts: thread
                                }

                                await Slack.chat.postMessage(params1);

                                const params2 = {
                                    token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                    channel: dataObj.event.channel,
                                    text: "Ok then have a nice day, Good bye !!",
                                    thread_ts: thread
                                }
                                await Slack.chat.postMessage(params2);

                            }
                            else if(dataObj.event.text.split(' ')[0].toLowerCase() !== "hello"){
                                const params = {
                                    token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                    channel: dataObj.event.channel,
                                    text: "Sorry I cannot understand you, do you need to post your daily task? (yes/no)",
                                    thread_ts: thread
                                }
                                
                                await Slack.chat.postMessage(params);
                            }
    
                            
                        }

                        if(step==1){
                            const params = {
                                token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                channel: dataObj.event.channel,
                                text: "Tell me the story number of task?",
                                thread_ts: thread
                            }
                            BotUtils.setUserProjectName(dataObj.event.user, dataObj.event.text);
                            BotUtils.setUserStep(dataObj.event.user, 2);
                            await Slack.chat.postMessage(params);
                        }

                        if(step==2){
                            const params = {
                                token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                channel: dataObj.event.channel,
                                text: "Tell me a description of your task?",
                                thread_ts: thread
                            }
                            BotUtils.setUserStoryNumber(dataObj.event.user, dataObj.event.text);
                            BotUtils.setUserStep(dataObj.event.user, 3);
                            await Slack.chat.postMessage(params);
                        }

                        if(step==3){
                            const params = {
                                token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                channel: dataObj.event.channel,
                                text: "Do you need to add another task? (yes/no)?",
                                thread_ts: thread
                            }
                            
                            BotUtils.setUserProjectDesc(dataObj.event.user, dataObj.event.text);
                            console.log(BotUtils.getUserAllProjectData(dataObj.event.user))
                            BotUtils.setUserStep(dataObj.event.user, 0);
                            await Slack.chat.postMessage(params);
                        }

                        if(step==4){
                            const params = {
                                token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                                channel: dataObj.event.channel,
                                text: "Sorry, session closed !!",
                                thread_ts: thread
                            }
                            //BotUtils.setUserStep(dataObj.event.user, 0);
                            await Slack.chat.postMessage(params);
                        }

                        // if(step==4){

                        //     if(dataObj.event.text.toLowerCase()== "yes"){


                        //     } else if(dataObj.event.text.toLowerCase()== "no") {

                        //     }

                        //     const params = {
                        //         token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                        //         channel: dataObj.event.channel,
                        //         text: "Sorry, session closed !! Do you need to add another task? (yes/no)?",
                        //         thread_ts: thread
                        //     }
                        //     BotUtils.setUserStep(dataObj.event.user, 0);
                        //     await Slack.chat.postMessage(params);
                        // }
                        
                    }

                    
                    // else if(dataObj.event.type === "message"){
                    //     const params = {
                    //         token: "xoxb-1692225498455-1751831409845-O8Sl1f9r1L7G3jdgVvDuqtyo",
                    //         channel: dataObj.event.channel,
                    //         text: "message"
                    //     }
    
                    //     await Slack.chat.postMessage(params);
                    // }

                    response.body = JSON.stringify({ "msg": "bot replied" });
                    break;

                default:
                    response.statusCode = 400;
                    response.body = JSON.stringify({ "msg": "Empty request" });
                    break;
            }
        }
    } catch (err) {
        response.statusCode = 500;
        response.body = JSON.stringify({ "msg": "Server error" });
    } finally {
        return response;
    }


};

async function verifyCall(data) {
    if (data.token == token) {
        console.log(data.token)
        return data.challenge;
    } else {
        throw 'Verification failed';
    }
}

