import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { withStyles } from "@material-ui/core";
import Configs from "app.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class Image extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _onClickDeleteIcon = () => {
    const { imageId, onDelete } = this.props;
    typeof onDelete == "function" && onDelete(imageId);
  };
  renderBody() {
    const {
      imageId,
      onDelete,
      classes,
      style,
      width,
      height,
      src,
    } = this.props;
    return (
      <div className={classes.root}>
        <img
          className={classes.image}
          src={
            src
              ? src
              : `${Configs.serviceHost}/api/file/GetFileDataById?fileId=${imageId}`
          }
          style={{
            width: width ? width : "100px",
            height: height ? height : "100px",
            maxHeight: "90vw",
            maxWidth: "80vw",
            ...style,
          }}
        />
        {onDelete ? (
          <FontAwesomeIcon
            icon={faTimes}
            onClick={this._onClickDeleteIcon}
            className={classes.deleteIcon}
            style={{ width: "16px", height: "16px" }}
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles({
  root: {
    position: "relative",
  },
  image: {
    margin: "16px",
  },
  deleteIcon: {
    background: "#8a000070",
    position: "absolute",
    top: 18,
    right: 18,
    cursor: "pointer",
    color: "white",
    borderRadius: "8px",
  },
})(Image);
