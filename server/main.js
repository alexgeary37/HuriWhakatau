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
import "/imports/api/discussionTemplate";
import "/imports/api/experiments"
import "/imports/api/accountsEmail"
import "/server/defaultData";
import "/imports/api/mountains";
import "/imports/api/users"
import "/imports/api/glossary";
import "/imports/api/commentRatings";

Meteor.startup(() => {
    process.env.MAIL_URL =
        // "smtps://juryrooms%40gmail.com:sxzvoqkplfteqpwk@smtp.gmail.com:465/";
        "smtps://huriwhakatau%40gmail.com:huriwhakataujuryroom@smtp.gmail.com:465/";
    // "smtps://dsten32%40gmail.com:RabbitseatpooGoogle@smtp.gmail.com:465/";
    // console.log("email set");


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


    SyncedCron.start(); // Runs once as soon as the server is started.


    if (Meteor.isServer) {
        //publish required information to client
        Meteor.publish("roles", function () {
            return Meteor.roleAssignment.find({});
        });
    }
});
