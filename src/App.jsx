import classes from "./App.module.css";

function App() {
  return (
    <div className={classes.app}>
      <div className={classes.wrapper}>
        <div className={classes.header}></div>
        <div className={classes.main}></div>
        <div className={classes.side}></div>
      </div>
    </div>
  );
}

export default App;
