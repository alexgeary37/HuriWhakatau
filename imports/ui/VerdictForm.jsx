import React, { useState } from "react";
import { Discussions } from "../api/discussions";
import { Verdicts } from "../api/verdicts";

export const VerdictForm = (discussionId) => {
  // 'setText' is a function we're declaring in the state of this
  // component in order to change the value of 'text'.
  const [text, setText] = useState(""); // "" is the default value for 'text'.

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything.
    Meteor.call("verdicts.insert", text.trim(), discussionId.discussionId);
    Meteor.call("discussions.removeProposer", discussionId.discussionId);
    let verdict = Verdicts.findOne({ authorId: Meteor.userId() });
    Meteor.call("discussions.addVerdict", discussionId.discussionId, verdict);
    setText("");
  };

  return (
    <form className="verdict-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your verdict here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />

      <button type="submit">Submit Verdict</button>
    </form>
  );
};
