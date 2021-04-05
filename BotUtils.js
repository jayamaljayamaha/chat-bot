
const AWS = require('aws-sdk');
const fileUtils = require('./fileUtils')
const SES = new AWS.SES();

var user_details = {};
var data = "";

module.exports.getUserStep = (user_id) => {

    return user_details[user_id].stepNo;
    

}

module.exports.setUserStep = (user_id, step) => {
    if (!(user_id in user_details)) {
        user_details[user_id] = {
            stepNo: 0,
            projectData : []
        }
    }
    user_details[user_id].stepNo = step;

}



module.exports.setUserProjectName = (user_id, project_name) => {
    data = "";
    let userProjectData = user_details[user_id].projectData

    let projectData = {
        projectName: project_name,
        storyNumber: "",
        prjectDesc: ""
    }
    userProjectData.push(projectData);
    // userProjectData[userProjectData.length] = {
    //     prjectName: project_name,
    //     storyNumber: "",
    //     prjectDesc: ""
    // }
    data = data + "["+ project_name +"] - ";
}

module.exports.setUserStoryNumber = (user_id, story_num) => {
    let userProjectData = user_details[user_id].projectData

    userProjectData[userProjectData.length-1].storyNumber = story_num

    data = data + story_num + " - ";

}

module.exports.setUserProjectDesc = (user_id, project_desc) => {
    let userProjectData = user_details[user_id].projectData
    
    userProjectData[userProjectData.length-1].prjectDesc = project_desc

    data = data + project_desc + "\n"
    console.log("data : "+data);
    fileUtils.writeData(data);
}


module.exports.getUserAllProjectData = (user_id) => {

    if(user_details[user_id].projectData.length == 0) {
        return "No any task data"
    }

    let data = "";

    for(project_data of user_details[user_id].projectData){
        data = data + "["+project_data.projectName +"] - "+ project_data.storyNumber + " - " + project_data.prjectDesc + ` - <@${user_id}>` + "\n"
    }

    return data
}

module.exports.getDataToEmail = () => {
    let data = "";
    console.log("My object : "+JSON.stringify(user_details));
    for(var key of Object.keys(user_details)){
        console.log(key);
        for(project_data of user_details[key].projectData){
            data = data + "["+project_data.prjectName +"] - "+ project_data.storyNumber + " - " + project_data.prjectDesc +" "+ user_details[key] + "\n"
        }
    }

    if(data === ""){
        return "No any task data"
    } else {
        return data;
    }
}
