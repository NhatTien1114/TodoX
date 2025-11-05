import React from "react";
import TaskEmptyState from "./TaskEmptyState";
import TaskCard from "./TaskCard";

const TaskList = ({filterTasks, filter, handleTaskChanged}) => {

    if (!filterTasks || filterTasks.length === 0) {
        return <TaskEmptyState filter={filter}/>;
    }

  return (
    <div className="space-y-3">
        {filterTasks.map((task, index) => (
            <TaskCard
                key={task._id}
                task={task}
                index={index}
                handleTaskChanged={handleTaskChanged}
            />
        ))}
    </div>
  );
};   
export default TaskList;