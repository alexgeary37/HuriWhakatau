import React from "react";
import classnames from "classnames";

export const Verdict = ({ verdict }) => {
  let classes = classnames("verdict");

  if (Meteor.userId() === verdict.authorId) {
    classes = classnames("verdict usersVerdict");
  }

  return (
    <li className={classes}>
      <span>{verdict.text}</span>
      {Meteor.userId() !== verdict.authorId && (
        <div>
          <button>Affirm</button>
          <button>Reject</button>
        </div>
      )}
    </li>
  );
};
