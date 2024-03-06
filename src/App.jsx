import classes from "./App.module.css";
import Header from "./components/Header/Header";
import { Divider } from "@mantine/core";

function App() {
  return (
    <div className={classes.app}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Header />
          <Divider my="md" />
        </div>
        <div className={classes.main}></div>
        <div className={classes.side}></div>
      </div>
    </div>
  );
}

export default App;
