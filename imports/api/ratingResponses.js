
// response sets for each type of rating type. new sets should have 7 values so that the scales
// are all treated consistently
const responses = [
    {
        type: "Frequency",
        fullRange: ["Never", "Almost Never", "Rarely", "Sometimes", "Often", "Almost Always", "Always"],
        range: "Never - Always",
    },
    {
        type: "Quality",
        fullRange: ["Very Poor", "Quite Poor", "Poor", "Fair", "Good", "Quite Good", "Excellent"],
        range: "Very Poor - Excellent",
    },
    {
        type: "Intensity",
        fullRange: ["None", "Very Mild", "Somewhat mild", "Mild", "Moderate", "Somewhat Severe", "Severe"],
        range: "None - Severe",
    },
    {
        type: "Agreement",
        fullRange: ["Strongly Disagree", "Disagree", "Somewhat Disagree", "Neither Agree nor Disagree", "Somewhat Agree",
            "Agree", "Strongly Agree"],
        range: "Strongly Disagree - Strongly Agree",
    },
    {
        type: "Approval",
        fullRange: ["Strongly Disapprove", "Disapprove", "Somewhat Disapprove", "Neutral", "Somewhat Approve", "Approve",
            "Strongly Approve"],
        range: "Strongly Disapprove - Strongly Approve",
    },
    {
        type: "Awareness",
        fullRange: ["Completely unaware", "Mostly unaware", "Moderately unaware", "Neither Aware nor Unaware",
            "Moderately Aware", "Very Aware", "Extremely Aware"],
        range: "Completely unaware - Extremely Aware",
    },
    {
        type: "Importance",
        fullRange: ["Not at all Important", "Low Importance", "Slightly Important", "Neither Important nor Unimportant",
            "Moderately Important", "Very Important", "Extremely Important"],
        range: "Not at all Important - Extremely Important",
    },
    {
        type: "Familiarity",
        fullRange: ["Completely unfamiliar", "Mostly unfamiliar", "Moderately unfamiliar", "Neither Familiar nor Unfamiliar",
            "Moderately Familiar", "Very Familiar", "Extremely Familiar"],
        range: "Completely unfamiliar - Extremely Familiar",
    },
    {
        type: "Satisfaction",
        fullRange: ["Completely dissatisfied", "Mostly dissatisfied", "Somewhat dissatisfied",
            "neither satisfied or dissatisfied", "Somewhat satisfied", "Mostly satisfied", "Completely satisfied"],
        range: "Completely dissatisfied - Completely satisfied",
    },
    {
        type: "Performance",
        fullRange: ["Far below standards", "Below standards", "Slightly below standards", "Meets Standards",
            "Slightly above standards", "Above standards", "Far above standards"],
        range: "Far below standards - Far above standards"
    },
    {
        type: "Acceptability",
        fullRange: ["Totally unacceptable", "Unacceptable", "Slightly unacceptable", "Neutral", "Slightly acceptable",
            "Acceptable", "Perfectly Acceptable "],
        range: "Totally unacceptable - Perfectly Acceptable"
    },
    {
        type: "Appropriateness",
        fullRange: ["Absolutely inappropriate", "Inappropriate", "Slightly inappropriate", "Neutral", "Slightly appropriate",
            "Appropriate", "Absolutely appropriate"],
        range: "Absolutely inappropriate - Absolutely appropriate"
    },
    {
        type: "Reflect Me",
        fullRange: ["Very untrue of me", "Untrue of me", "Somewhat untrue of me", "Neutral", "Somewhat true of me",
            "True of me", "Very true of me"],
        range: "Very untrue of me - Very true of me"
    },
    {
        type: "My beliefs",
        fullRange: ["Very untrue of what I believe", "Untrue of what I believe", "Somewhat untrue of what I believe", "Neutral",
            "Somewhat true of what I believe", "True of what I believe", "Very true of what I believe"],
        range: "Very untrue of what I believe - Very true of what I believe"
    },
    {
        type: "Concern",
        fullRange: ["Completely unconcerned", "Somewhat unconcerned", "Slightly unconcerned",
            "Neither concerned nor unconcerned", "Slightly concerned", "Moderately concerned", "Extremely concerned"],
        range: "Completely unconcerned -Extremely concerned",
    },
    {
        type: "Problem",
        fullRange: ["Not at all a problem", "Slight problem", "Minor problem", "Moderate problem", "Problem", "Serious problem",
            "Extreme problem"],
        range: "Not at all a problem - Extreme problem",
    },
    {
        type: "Support",
        fullRange: ["Strongly oppose", "Somewhat oppose", "Slightly oppose", "neutral", "Slightly favor", "Somewhat favor",
            "Strongly favor"],
        range: "Strongly oppose - Strongly favor",
    },
    {
        type: "Desirability",
        fullRange: ["Very undesirable", "Undesirable", "Moderately undesirable", "neutral", "Moderately desirable",
            "Desirable", "Very desirable"],
        range: "Very undesirable - Very desirable",
    },
    {
        type: "Influence",
        fullRange: ["Not at all influential", "Slightly influential", "Somewhat influential", "Moderately influential",
            "Influential", "Very influential", "Extremely influential"],
        range: "Not at all influential - Extremely influential",
    },
    {
        type: "Accuracy",
        fullRange: ["Very Inaccurate", "Moderately Inaccurate", "Neither Accurate Nor Inaccurate", "Moderately Accurate",
            "Very Accurate"],
        range: "Very Inaccurate - Very Accurate",
    },
];
// Sort alphabetically by type on export
export const responseSet = responses.sort((a, b) => (a.type > b.type) ? 1 : -1)
// When the response sets are used in the rating component use the below indices to pull out the correct labels
// depending on the scale specified by the researcher eg 2 point scale only shows the first and last rating in the set.
export const indices = {2: [0, 6], 3: [0, 3, 6], 5: [0, 2, 3, 4, 6], 7: [0, 1, 2, 3, 4, 5, 6]};



