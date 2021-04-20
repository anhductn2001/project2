import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.open = () => {
      this.setState({ isOpen: true });
    };
    this.close = () => {
      this.setState({ isOpen: false });
    };
  }
  render() {
    const { classes } = this.props;
    const { isOpen } = this.state;
    return (
      <div
        className={classes.root}
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <Backdrop style={{ zIndex: 9999, color: "#fff" }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

export default withStyles({
  root: {
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: 9999999,
  },
})(Loading);
