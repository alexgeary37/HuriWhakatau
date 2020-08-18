import React, { useState } from "react";
import { Verdicts } from "../api/verdicts";

export const VerdictForm = (discussionId) => {
  // 'setText' is a function we're declaring in the state of this
  // component in order to change the value of 'text'.
  const [text, setText] = useState(""); // "" is the default value for 'text'.

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything.
    Meteor.call("verdicts.insert", text.trim(), discussionId.discussionId);
    setText("");
  };

  const handleCancel = () =>
    Meteor.call("discussions.removeProposer", discussionId.discussionId);

  return (
    <div>
      <form className="verdict-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your verdict here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <button type="submit">Submit Verdict</button>
        </div>
      </form>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};
