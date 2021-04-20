import React from "react";
import { withStyles, Typography, IconButton } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import classnames from "classnames";
import ClearIcon from "@material-ui/icons/Clear";
class CustomModal extends React.Component {
  render() {
    const {
      classes,
      fullScreen,
      content,
      onClose,
      className,
      open,
      title,
      style,
    } = this.props;
    const container = classnames({
      [classes.container]: true,
      [classes.fullScreen]: fullScreen,
      [className]: true,
    });
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.root}
        open={open ? open : false}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.open}>
          <div className={container} style={style}>
            <div className={classes.header}>
              <Typography variant="h5" className={classes.title}>
                {title}
              </Typography>
              <IconButton onClick={onClose}>
                <ClearIcon />
              </IconButton>
            </div>
            <div className={classes.body}>{content}</div>
          </div>
        </Fade>
      </Modal>
    );
  }
}

export default withStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    height: "90vh",
    width: "80vw",
    backgroundColor: "rgba(255, 255, 255, 1);",
    boxShadow: "0px 3px 5px 1px #aaa",
    borderRadius: "10px",
    padding: 0,
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #ccc",
  },
  body: {},
  fullScreen: {
    height: "100vh",
    width: "100vw",
    borderRadius: "0px",
  },
  title: {
    padding: "15px 30px 10px",
    textTransform: "uppercase",
  },
})(CustomModal);
