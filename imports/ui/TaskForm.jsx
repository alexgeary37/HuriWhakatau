import React, { useState, useReducer } from 'react';
//import Tasks from '/imports/api/tasks';

export const TaskForm = () => {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text) return;

        Meteor.call('tasks.insert', text.trim());

        setText("");
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Tyoe to add task"
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};