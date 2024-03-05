import { Grid, Container } from "@mantine/core";
import classes from "./Layout.module.css";

function Layout() {
  return (
    <Grid
      classNames={{ root: classes.root, inner: classes.inner }}
      grow
      gutter="sm"
    >
      <Grid.Col span={12}>
        <Container>Default Container</Container>
      </Grid.Col>
      <Grid.Col span={8} className={classes.column}>
        <Container>Default Container</Container>
      </Grid.Col>
      <Grid.Col span={4} className={classes.column}>
        <Container>Default Container</Container>
      </Grid.Col>
    </Grid>
  );
}

export default Layout;
