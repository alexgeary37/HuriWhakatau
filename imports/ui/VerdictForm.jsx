import React, { useState } from "react";

export const VerdictForm = ({ discussionId }) => {
  const [text, setText] = useState(""); // "" is the default value for 'text'.

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything.
    Meteor.call("verdicts.insert", text.trim(), discussionId);
    setText("");
  };

  const handleCancel = () =>
    Meteor.call("discussions.removeProposer", discussionId);

  return (
    <div className="verdict-form">
      <input
        type="text"
        placeholder="Type your verdict here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Verdict</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};
