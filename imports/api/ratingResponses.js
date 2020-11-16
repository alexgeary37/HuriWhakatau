export const responseSet = [
    {
        type: "Frequency",
        range: ["Never", "Almost Never", "Rarely", "Sometimes", "Often", "Almost Always", "Always"],
    },
    {
        type: "Quality",
        range: ["Very Poor", "Quite Poor", "Poor", "Fair", "Good", "Quite Good", "Excellent"]
    },
    {
        type: "Intensity",
        range: ["None", "Very Mild", "Somewhat mild", "Mild", "Moderate", "Somewhat Severe", "Severe"]
    },
    {
        type: "Agreement",
        range: ["Strongly Disagree", "Disagree", "Somewhat Disagree", "Neither Agree nor Disagree", "Somewhat Agree",
            "Agree", "Strongly Agree"]
    },
    {
        type: "Approval",
        range: ["Strongly Disapprove", "Disapprove", "Somewhat Disapprove", "Neutral", "Somewhat Approve", "Approve",
            "Strongly Approve"]
    },
    {
        type: "Awareness",
        range: ["Completely unaware", "Mostly unaware", "Moderately unaware", "Neither Aware nor Unaware",
            "Moderately Aware", "Very Aware", "Extremely Aware"]
    },
    {
        type: "Importance",
        range: ["Not at all Important", "Low Importance", "Slightly Important", "Neither Important nor Unimportant",
            "Moderately Important", "Very Important", "Extremely Important"]
    },
    {
        type: "Familiarity",
        range: ["Completely unfamiliar", "Mostly unfamiliar", "Moderately unfamiliar", "Neither Familiar nor Unfamiliar",
            "Moderately Familiar", "Very Familiar", "Extremely Familiar"]
    },
    {
        type: "Satisfaction",
        range: ["Completely dissatisfied", "Mostly dissatisfied", "Somewhat dissatisfied",
            "neither satisfied or dissatisfied", "Somewhat satisfied", "Mostly satisfied", "Completely satisfied"]
    },
    {
        type: "Performance",
        range: ["Far below standards", "Below standards", "Slightly below standards", "Meets Standards",
            "Slightly above standards", "Above standards", "Far above standards"]
    },
    {
        type: "Acceptability",
        range: ["Totally unacceptable", "Unacceptable", "Slightly unacceptable", "Neutral", "Slightly acceptable",
            "Acceptable", "Perfectly Acceptable "]
    },
    {
        type: "Appropriateness",
        range: ["Absolutely inappropriate", "Inappropriate", "Slightly inappropriate", "Neutral", "Slightly appropriate",
            "Appropriate", "Absolutely appropriate"]
    },
    {
        type: "Reflect Me",
        range: ["Very untrue of me", "Untrue of me", "Somewhat untrue of me", "Neutral", "Somewhat true of me",
            "True of me", "Very true of me"]
    },
    {type: "My beliefs",
    range: ["Very untrue of what I believe", "Untrue of what I believe", "Somewhat untrue of what I believe", "Neutral",
        "Somewhat true of what I believe", "True of what I believe", "Very true of what I believe"]},
    {type: "Concern",
    range: ["Completely unconcerned", "Somewhat unconcerned", "Slightly unconcerned",
        "Neither concerned nor unconcerned", "Slightly concerned", "Moderately concerned", "Extremely concerned"]},
    {type: "Problem",
    range: ["Not at all a problem", "Slight problem", "Minor problem", "Moderate problem", "Problem", "Serious problem",
        "Extreme problem"]},
    {type: "Support",
        range: ["Strongly oppose", "Somewhat oppose", "Slightly oppose", "neutral", "Slightly favor", "Somewhat favor",
            "Strongly favor"]},
    {type: "Desirability",
        range: ["Very undesirable", "Undesirable", "Moderately undesirable", "neutral", "Moderately desirable",
            "Desirable", "Very desirable"]},
];

export const indices = {2: [0, 6], 3: [0, 3, 6], 5: [0, 2, 3, 4, 6], 7: [0, 1, 2, 3, 4, 5, 6]};
