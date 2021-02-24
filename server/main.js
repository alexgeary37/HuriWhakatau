import {Meteor} from "meteor/meteor";
import {Discussions} from "../imports/api/discussions";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/scenarioSets";
import "/imports/api/discussions";
import "/imports/api/comments";
import "/imports/api/verdicts";
import "/imports/api/votes";
import "/imports/api/security";
import "/imports/api/topics";
import "/imports/api/categories";
import "/imports/api/discussionTemplates";
import "/imports/api/experiments"
import "/imports/api/accountsEmail"
import "/server/defaultData";
import "/imports/api/mountains";
import "/imports/api/rivers"
import "/imports/api/users"
import "/imports/api/glossary";
import "/imports/api/commentRatings";
import "/imports/api/tutorialVideos";

Meteor.startup(() => {
    // modified from Chris Symon's code, scheduled job to set status
    // of timed out discussions.
    // Runs only once as soon as server is started. Creates a job for
    // the server to do. Job has a name, a schedule for how often it
    // is to be performed and a task/function to perform. Task is to
    // check all discussions to see whether they have passed their
    // deadline or not.
    SyncedCron.add({
        name: "checkDiscussionDeadline", // Name of the job.
        // Sets up the schedule for when the job is to be run.
        schedule(parser) {
            return parser
                .recur()
                .on(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
                .minute(); // EVERY 5 minutes
        },

        // The job which runs periodically according to the set schedule.
        job(dateTime) {
            // Bulk update all discussions with status of active but with a deadline that has passed.
            console.log("dateTime: ", dateTime);
            Discussions.rawCollection().updateMany({
                status: "active",
                deadline: {$lte: dateTime}
            }, {$set: {status: "timedout"}})
        }
    });

    //a job for reverting emotional state for users after 3 minutes
    SyncedCron.add({
        name: "checkEmotionState", // Name of the job.
        // Sets up the schedule for when the job is to be run.
        schedule(parser) {
            return parser
                .recur()
                .on(0)
                .second(); // EVERY 1 minute
        },

        // The job which runs periodically according to the set schedule.
        job() {
            // Bulk update all users whose emotional state was set > 3 minutes ago back to neutral.
            Meteor.users.rawCollection().updateMany({
                "profile.emotion.timestamp": {$lte: Date.now() - 180000}
            }, {$set: {"profile.emotion.emotion": "neutral"}})
        }
    });



    SyncedCron.start(); // Runs once as soon as the server is started.


    if (Meteor.isServer) {
        //publish required information to client
        Meteor.publish("roles", function () {
            return Meteor.roleAssignment.find({});
        });
    }
});

if (!process.env.MONGO_URL.includes("juryroom_admin")) {
    Meteor.methods({
        "main.removeAll"() {
            Meteor.call("categories.removeAll");
            Meteor.call("topics.removeAll");
            Meteor.call("groups.removeAll");
            Meteor.call("discussionTemplates.removeAll");
            Meteor.call("scenarios.removeAll");
            Meteor.call("scenarioSets.removeAll");
            Meteor.call("mountains.removeAll");
            Meteor.call("rivers.removeAll");
            Meteor.call("personality.removeAll");
            Meteor.call("experiments.removeAll");
            Meteor.call("discussions.removeAll");
            Meteor.call("comments.removeAll");
            Meteor.call("commentRatings.removeAll");
            Meteor.call("verdicts.removeAll");
            Meteor.call("votes.removeAll");
            Meteor.call('usernames.removeAll');
        },
    
        "main.removeAllDiscussions"() {
            Meteor.call("experiments.removeAll");
            Meteor.call("discussions.removeAll");
            Meteor.call("comments.removeAll");
            Meteor.call("commentRatings.removeAll");
            Meteor.call("verdicts.removeAll");
            Meteor.call("votes.removeAll");
        }
    });
} else {
    console.log('App is connected to juryroom database');
}