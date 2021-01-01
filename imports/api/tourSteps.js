import React from "react";

export const dashSplash = [
    {
        target: '.signUp',
        content: (
            <div>
                <p>
                    Sign up for more access.
                </p>
            </div>
        )
    }
];

export const myDashParticipant = [
    {
        target: ".myDiscussions",
        content: (<div>
            <p>Here are the discussions you are part of.</p>
            <p>Click one to add comments</p>
        </div>)
    },
    {
        target: ".finishedDiscussions",
        content: (<div>
            <p>Here are discussions that have concluded and can no longer have new comments.</p>
            <p>Click one to see how the discussion went</p>
        </div>)
    },
    {
        target: ".myGroups",
        content: (<div>
            <p>Here are the groups you are part of.</p>
            <p>Click 'Open' to see your fellow group members or leave the group</p>
        </div>)
    },
    {
        target: ".newDiscussion",
        content: (<div>
            <p>Click here to start a new discussion.</p>
        </div>)
    },
];

export const myDashResearcher = [
    {
        target: ".discussionTemplates",
        content: (<div>
            <p>Here are your discussion templates.</p>
            <p>By default you get three pre-made templates.</p>
            <p> Click 'Open' to see the parameters set in each template.</p>
        </div>)
    },
    {
        target: ".myScenarios",
        content: (<div>
            <p>Here are your scenarios.</p>
            <p>A scenario is a combination of discussion topic, discussion template and discussion category.
                This determines what your users will be talking about and what discussion options will be enabled.</p>
            <p>Click the 'Open' button to see the scenario details.</p>
        </div>)
    },
    {
        target: ".myScenarioSets",
        content: (<div><p>Here are your scenario sets.</p>
            <p>A scenario set is a list of individual scenarios.
                When added to an Experiment this will create the discussions you want to group together.</p>
            <p>Click the 'Open' button to see the scenario list.</p></div>)
    },
    {
        target: ".myExperiments",
        content: (<div>
            <p>Here are your experiments. This is where the magic happens.</p>
            <p>An experiment is a combination of a user group with a scenario set.
                On creating the experiment all the associated discussions will be generated with the
                setting determined by the discussion templates associated with each scenario.
                Once generated the discussions will be available to the selected users to participate in.</p>
            <p>Click the 'Open' button to see the experiment details.</p></div>)
    },
];

export const myUserSettings = [{
    target: ".myPepeha",
    content: (<div>
        <p>This is your pepeha.</p>
        <p>Here you can fill out your personal story.</p>
        <p>If you don't have a pepeha then click the link below and see what it's all about.</p></div>)
}];

export const huichatTour = [{
    target: ".participants",
    content: (<div>
        <p>This area shows the group participants. You can see each other's pepeha info by hovering over the icons.</p>
        <p>This is also where you vote for group leader, select your current emotional state and move to the next
            discussion.</p></div>)
},
    {
        target: '.participants',
        content: (<div>
            <p>When you click an emoji that will change your panel colour to match and any comments made will have
                the same colour border.</p>
            <p>Only you and the group leader will see this change and it will allow the group leader to guide the
                discussion in a productive direction.</p>
            <p>Play around with that. It will automatically reset after three minutes</p>
        </div>)
    },
    {
        target: '.participants',
        content: (<div>
            <p>Group leaders, once elected, can submit verdicts for voting on and choose when the discussion
                has ended and should move to the next discussion.</p>
        </div>)
    },
];
