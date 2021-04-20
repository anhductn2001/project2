import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
class AlertifyManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [] };
    this._self = this;
    this.addNewAlertify = (content, type) => {
      this.count++;
      let notification = {
        content: content,
        type: type,
      };
      this.state.notifications.unshift(notification);
      this.setState({ notifications: this.state.notifications });
      setTimeout(() => {
        let a = [];
        this.state.notifications.forEach((n) => {
          if (notification != n) a.push(n);
        });
        this.setState({ notifications: a });
      }, 4000);
    };
  }
  _removeNotification = (notification) => {
    let a = [];
    this.state.notifications.forEach((n) => {
      if (notification != n) a.push(n);
    });
    this.setState({ notifications: a });
  };
  render() {
    const { classes } = this.props;
    const { notifications } = this.state;
    return (
      <div className={classes.root}>
        {notifications.map((n, i) => {
          var wrapperClassName = cx({
            [classes.wrapper]: true,
            [classes[n.type]]: true,
          });
          return (
            <div key={"alertifi" + i} className={wrapperClassName}>
              <p className={classes.content}>{n.content}</p>
              <FontAwesomeIcon
                icon={faTimes}
                onClick={() => this._removeNotification(n)}
                className={classes.icon}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles({
  root: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "fit-content",
    height: "fit-content",
    zIndex: 99999,
  },
  wrapper: {
    width: "250px",
    padding: "16px",
    marginTop: "8px",
    color: "#fff",
    borderRadius: "5px",
    backgroundColor: "#aaa",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  content: {
    margin: 0,
    flexGrow: 1,
  },
  success: {
    backgroundColor: "#5cb860",
  },
  error: {
    backgroundColor: "#f55a4e",
  },
  warning: {
    backgroundColor: "#ffa21a",
  },
  icon: {
    cursor: "pointer",
    marginLeft: "16px",
  },
})(AlertifyManager);
