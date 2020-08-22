import React, { useState } from "react";

export const CommentForm = ({ discussionId }) => {
  // 'setText' is a function we're declaring in the state of this
  // component in order to change the value of 'text'.
  const [text, setText] = useState(""); // "" is the default value for 'text'.

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything.
    Meteor.call("comments.insert", text.trim(), discussionId);
    setText("");
  };

  return (
    <div className="comment-form">
      <input
        type="text"
        placeholder="Type your comment here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <button onClick={handleSubmit}>Add Comment</button>
    </div>
  );
};
