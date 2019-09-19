const rosterDatabase = require('./roster-list');
const SLACK_CONFIG = require('./slack-config');
const axios = require('axios');
const fs = require('fs');

const deploymentBackendList = rosterDatabase.deploymentBackendList;
const roadShowList = rosterDatabase.roadShowList;
const sprintReviewBackEndList = rosterDatabase.sprintReviewBackEndList;
const sprintReviewFrontEndList = rosterDatabase.sprintReviewFrontEndList;
const scrumOfScrumList = rosterDatabase.scrumOfScrumList;

const sprintReviewFrontEndPerson = sprintReviewFrontEndList[0];
const sprintReviewBackEndPerson = sprintReviewBackEndList[0];
const scrumOfScrumPerson = scrumOfScrumList[0];
const roadShowPerson = roadShowList[0];
const deploymentBackendPerson = deploymentBackendList[0];

const slackPayload = {
    "channel": `${SLACK_CONFIG.channel}`,
    "username": `${SLACK_CONFIG.username}`,
    "icon_emoji": `${SLACK_CONFIG.icon_emoji}`,
    "text": `${SLACK_CONFIG.messageTitle}`,
    "attachments": [
        {
            "color": "good",
            "fields": [
                {
                    "title": "Scrum of Scrum",
                    "value": `${scrumOfScrumPerson}`
                }
            ]
        },
        {
            "color": "warning",
            "fields": [
                {
                    "title": "Sprint Review",
                    "value": `FE: ${sprintReviewFrontEndPerson} \n BE: ${sprintReviewBackEndPerson}`
                }
            ]
        },
        {
            "color": "warning",
            "fields": [
                {
                    "title": "Backend Deployment",
                    "value": `${deploymentBackendPerson}`
                }
            ]
        },
        {
            "color": "danger",
            "fields": [
                {
                    "title": "Road Show!",
                    "value": `${roadShowPerson}`
                }
            ]
        }
    ]
};

// Post to Slack channel
axios.post(SLACK_CONFIG.slackUrl, slackPayload);

// Update the roster list database for next round
deploymentBackendList.push(deploymentBackendList.shift());
roadShowList.push(roadShowList.shift());
sprintReviewBackEndList.push(sprintReviewBackEndList.shift());
sprintReviewFrontEndList.push(sprintReviewFrontEndList.shift());
scrumOfScrumList.push(scrumOfScrumList.shift());

const stringifiedRosterList = JSON.stringify(rosterDatabase);

fs.writeFile("roster-list.json", stringifiedRosterList, 'utf8', err => {
    if (err) {
        console.log("An error occurred while writing roster list to file.");
        return console.log(err);
    }

    console.log("Roster list has been updated!");
});
