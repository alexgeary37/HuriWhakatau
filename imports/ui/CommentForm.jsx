import React, { useState } from "react";

export const CommentForm = () => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything
    Meteor.call("comments.insert", text.trim());
    setText("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your comment here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">Add Comment</button>
    </form>
  );
};
