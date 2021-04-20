import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import Webcam from "react-webcam";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";
import Image from "views/general/Image";
import TrainingFace from "views/student/components/TrainingFace";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";

class TrainingFacePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      trainingImages: [],
    };
    this.studentId = sensitiveStorage.getStudentId();
    this.count = 0;
  }
  _onClickTrainFaceBtn = () => {
    const { trainingImages } = this.state;
    this.openModal({
      content: <TrainingFace trainingImages={trainingImages} />,
      title: "Train face",
      fullScreen: true,
    });
  };
  _getStudentInfo = () => {
    this.ajaxGet({
      url: `/api/student/GetStudentInfo?studentId=${this.studentId}`,
      success: (apiResult) => {
        this.setState({ trainingImages: apiResult.data.trainingImages });
      },
      unsuccess: (apiResult) => {
        this._error(apiResult.messages[0]);
      },
    });
  };
  componentDidMount() {
    this._getStudentInfo();
  }
  componentWillUnmount(){
    this.setState({
      trainingImages : []
    })
  }
  renderBody() {
    const { classes } = this.props;
    const { trainingImages } = this.state;
    this.count++;
    console.log("training face page", this.count);
    return (
      <GridContainer>
        <Grid item xs={12}>
          <Card profile style={{ marginTop: 0 }}>
            <CardHeader color="primary">
              <Typography
                variant="h5"
                style={{ color: "#fff", textAlign: "left" }}
              >
                Dữ liệu khuôn mặt
              </Typography>
            </CardHeader>
            <CardBody style={{ padding: "25px 20px 30px" }}>
              <div className={classes.imageWrapper}>
                {trainingImages.map((t) => (
                  <Image
                    imageId={t.fileId}
                    key={t.fileId + "1"}
                    onDelete={this._onDeleteTrainImage}
                  />
                ))}
              </div>
              <p style={{ textAlign: "center", fontStyle: "italic" }}>
                Để đảm bảo tính năng điểm danh tự động được chính xác, vui lòng
                cập nhật dữ liệu nhận diên khuôn mặt ít nhất 10 dữ liệu.
              </p>
              <Button
                onClick={this._onClickTrainFaceBtn}
                variant="contained"
                color="secondary"
              >
                Chỉnh sửa
              </Button>
            </CardBody>
          </Card>
        </Grid>
      </GridContainer>
    );
  }
}

export default withStyles({
  webcam: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    margin: "16px",
  },
  captureButton: {
    position: "absolute",
    bottom: 0,
    left: "calc(50% - 30px)",
    color: "#fff",
  },
  title: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "uppercase",
  },
  subTitle: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "capitalize",
    fontWeight: "normal",
  },
  image: {
    cursor: "pointer",
  },
  imageWrapper: {
    display: "flex",
    flexWrap: "wrap",
    overflowX: "auto",
    margin: "0 8px",
  },
})(TrainingFacePage);
