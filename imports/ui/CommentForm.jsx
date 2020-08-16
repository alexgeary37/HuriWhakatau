import React, { useState } from "react";

export const CommentForm = (discussionId) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything
    Meteor.call("comments.insert", text.trim(), discussionId.discussionId);
    setText("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your comment here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />

      <button type="submit">Add Comment</button>
    </form>
  );
};
