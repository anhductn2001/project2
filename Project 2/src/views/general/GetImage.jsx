import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
  Checkbox,
} from "@material-ui/core";
import Webcam from "react-webcam";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";
import Image from "views/general/Image";
import { isThisISOWeek } from "date-fns/esm";
import { ClassStatus } from "core/Enum";
import RCSTable from "views/general/RCSTable";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

class GetImage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.webcamRef = React.createRef();
    this.upLoadFileRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "environment",
    };
    this.studentId = sensitiveStorage.getStudentId();
  }
  _onCapture = (e) => {
    var image = this.webcamRef.current.getScreenshot();
    this._onGetImageCapture(image);
  };
  _onGetImageCapture = (image) => {
    const { onGetImageCapture } = this.props;
    typeof onGetImageCapture === "function" && onGetImageCapture(image);
  };
  _onGetImageUpload = (image) => {
    const { onGetImageUpload } = this.props;
    typeof onGetImageUpload === "function" && onGetImageUpload(image);
  };
  _onClickUploadFile = (e) => {
    this.upLoadFileRef.current.click();
  };
  _onSelectImage = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      console.log(files[0]);
      this._onGetImageUpload(files[0]);
    }
  };
  getBase64(file, callback) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      typeof callback === "function" && callback(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }
  renderBody() {
    const { classes } = this.props;
    // console.log("get image");
    return (
      <div className={classes.root}>
        <Webcam
          audio={false}
          width={800}
          ref={this.webcamRef}
          screenshotFormat="image/jpg"
          videoConstraints={this.videoConstraints}
        />
        <div className={classes.control}>
          <IconButton
            onClick={this._onCapture}
            className={classes.controlButton}
          >
            <PhotoCameraIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={this._onClickUploadFile}
            className={classes.controlButton}
          >
            <CloudUploadIcon fontSize="large" />
          </IconButton>
          <input
            type="file"
            accept="image/png, image/jpeg,image/jpg"
            ref={this.upLoadFileRef}
            onChange={this._onSelectImage}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles({
  root: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    margin: "16px",
  },
  control: {
    position: "absolute",
    bottom: 0,
    left: "calc(50% - 60px)",
    display: "flex",
    flexDirection: "row",
  },
  controlButton: {
    margin: "8px 16px",
    color: "#fff",
  },
})(GetImage);
