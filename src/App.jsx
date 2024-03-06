import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Side from "./components/Side/Side";
import { Divider } from "@mantine/core";

function App() {
  return (
    <div className={classes.app}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Header />
          <Divider my="md" />
        </div>
        <div className={classes.main}>
          <Main />
        </div>
        <div className={classes.side}>
          <Side />
        </div>
      </div>
    </div>
  );
}

export default App;
