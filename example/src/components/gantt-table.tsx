import React from "react";
import "gantt-task-react/dist/index.css";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";

//Gantt with Custom table example
type GanttTableExampleProps = { tasks: Task[] } & EventOption & DisplayOption;
export const GanttTableExample: React.SFC<GanttTableExampleProps> = props => {
  const gridColumnWidth = 150;
  let options: StylingOption = {
    fontSize: "14px",
    fontFamily:
      "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
    headerHeight: 50,
    rowHeight: 50,
  };
  if (props.viewMode === ViewMode.Month) {
    options.columnWidth = 300;
  } else if (props.viewMode === ViewMode.Week) {
    options.columnWidth = 250;
  }

  const [tasks, setTasks] = React.useState(props.tasks);
  const onTaskDateChange = async (task: Task) => {
    if (props.onDateChange) {
      try {
        await props.onDateChange(task);
      } catch (e) {
        throw e;
      }
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
  };

  const onTaskProgressChange = async (task: Task) => {
    if (props.onProgressChange) {
      try {
        await props.onProgressChange(task);
      } catch (e) {
        setTasks(props.tasks.slice());
        throw e;
      }

      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
  };

  const onTaskItemDelete = async (task: Task) => {
    if (props.onTaskDelete) {
      await props.onTaskDelete(task);
      setTasks(tasks.filter(t => t.id !== task.id));
    }
  };

  return (
    <div className="Wrapper">
      <div
        className="GanttTable"
        style={{
          fontFamily: options.fontFamily,
          fontSize: options.fontSize,
        }}
      >
        <div
          className="GanttTable-header"
          style={{
            height: options.headerHeight,
          }}
        >
          <div
            className="GanttTable-headerItem"
            style={{
              minWidth: gridColumnWidth,
            }}
          >
            <span role="img" aria-label="fromDate" className="GanttTable-icon">
              📃
            </span>
            Name
          </div>
          <div
            className="GanttTable-headerItem"
            style={{
              minWidth: gridColumnWidth,
            }}
          >
            <span role="img" aria-label="fromDate" className="GanttTable-icon">
              📅
            </span>
            From
          </div>
          <div
            className="GanttTable-headerItem"
            style={{
              minWidth: gridColumnWidth,
            }}
          >
            <span role="img" aria-label="toDate" className="GanttTable-icon">
              📅
            </span>
            To
          </div>
        </div>
        {tasks.map(t => {
          return (
            <div
              className="GanttTable-row"
              style={{ height: options.rowHeight }}
            >
              <div className="GanttTable-cell">{t.name}</div>
              <div className="GanttTable-cell">{t.start.toDateString()}</div>
              <div className="GanttTable-cell">{t.end.toDateString()}</div>
            </div>
          );
        })}
      </div>
      <div style={{ overflowX: "scroll" }}>
        <Gantt
          {...options}
          {...props}
          tasks={tasks}
          onDateChange={onTaskDateChange}
          onTaskDelete={onTaskItemDelete}
          onProgressChange={onTaskProgressChange}
        />
      </div>
    </div>
  );
};
