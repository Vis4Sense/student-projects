import React from "react";
import styles from "./Tasks.module.css";

const Tasks = ({tasks}) => {


return (
    <div className={styles.tasks}>
        {tasks.map((task, index) => (
            <div key={task.id || index} className={styles.task}>
                <h3>{task.name}</h3>
            </div>
        ))}
    </div>
);


}



export default Tasks;