import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
  Checkbox,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import Webcam from "react-webcam";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";
import Image from "views/general/Image";
import { isThisISOWeek } from "date-fns/esm";
import { ClassStatus } from "core/Enum";
import RCSTable from "views/general/RCSTable";
import GetImage from "views/general/GetImage";
import $ from "jquery";
import { RollCallType } from "core/Enum";
import { isMobile, isMobileOrTablet } from "core/Helper";

class RollCall extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { 
      review: true,
      width: window.innerWidth,
      imagePhone: ""
    };
    this.webcamRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "environment",
      file: null,
    };
    this.studentId = sensitiveStorage.getStudentId();
    this.loadData = false;
  }
  _onGetImageCapture = (image) => {
    this._rollCall(image);
  };
  _onGetImageUpload = (image) => {
    this._rollCallByImageUpload(image);
  };
  _rollCallByImageUpload = (image) => {
    let { classSchedule } = this.props;
    const data = new FormData();
    data.append(classSchedule.id.toString(), image);
    this.ajaxPost({
      url: "/api/Class/RollCallByImageUpload",
      data: data,
      noDataType: true,
      noProcessData: true,
      noContentType: true,
      success: (r) => {
        r.data.rollCalls.forEach((d) => {
          let ok = false;
          classSchedule.rollCalls.forEach((rc) => {
            if (
              rc.studentId == d.studentId &&
              rc.classScheduleId == d.classScheduleId
            ) {
              Object.keys(d).map((i) => {
                rc[i] = d[i];
              });
              ok = true;
            }
          });
          if (!ok) {
            classSchedule.rollCalls.push(d);
          }
        });
        this.setState({}, () => {
          if (this.state.review) {
            this.openModal({
              content: (
                <Image
                  width="auto"
                  height="auto"
                  src={`data:image/png;base64,${r.data.base64Image}`}
                />
              ),
              style: {
                maxWidth: "80vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
              },
            });
          }
        });
        this.success("Điểm danh thành công.");
      },
      unsuccess: (r) => {
        if (this.state.review) {
          this.openModal({
            content: (
              <Image
                width="auto"
                height="auto"
                src={`data:image/png;base64,${r.data.base64Image}`}
              />
            ),
            style: {
              maxWidth: "80vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
            },
          });
        }
        this.error(r.messages[0]);
      },
    });
  };
  _rollCall = (image) => {
    let { classSchedule } = this.props;
    var a = image.split(",");
    var data = {
      classScheduleId: classSchedule.id,
      base64Image: a[1],
    };
    this.ajaxPost({
      url: "/api/Class/RollCall",
      data: data,
      success: (r) => {
        r.data.rollCalls.forEach((d) => {
          let ok = false;
          classSchedule.rollCalls.forEach((rc) => {
            if (
              rc.studentId == d.studentId &&
              rc.classScheduleId == d.classScheduleId
            ) {
              Object.keys(d).map((i) => {
                rc[i] = d[i];
              });
              ok = true;
            }
          });
          if (!ok) {
            classSchedule.rollCalls.push(d);
          }
        });
        this.setState({}, () => {
          if (this.state.review) {
            this.openModal({
              content: (
                <Image
                  width="auto"
                  height="auto"
                  src={`data:image/png;base64,${r.data.base64Image}`}
                />
              ),
              style: {
                maxWidth: "80vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
              },
            });
          }
        });
        this.success("Điểm danh thành công.");
      },
      unsuccess: (r) => {
        if (this.state.review) {
          this.openModal({
            content: (
              <Image
                width="auto"
                height="auto"
                src={`data:image/png;base64,${r.data.base64Image}`}
              />
            ),
            style: {
              maxWidth: "80vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
            },
          });
        }
        this.error(r.messages[0]);
      },
    });
  };
  _getClassScheduleFullData = () => {
    let { classSchedule } = this.props;
    this.ajaxGet({
      url: `/api/class/getClassScheduleFullData?classScheduleId=${classSchedule.id}`,
      success: (r) => {
        this.loadData = true;
        Object.keys(classSchedule).forEach((i) => {
          classSchedule[i] = r.data[i];
        });
        this.setState({});
      },
      unsuccess: (r) => {
        if (this.state.review) {
          this.openModal({
            content: (
              <Image
                width="auto"
                height="auto"
                src={`data:image/png;base64,${r.data.base64Image}`}
              />
            ),
            style: {
              maxWidth: "80vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
            },
          });
        }
        this.error(r.messages[0]);
      },
    });
  };
  componentDidMount() {
    this._getClassScheduleFullData();
    window.addEventListener('resize', this.resizeScreen);
  }
  resizeScreen = () =>{
    this.setState({
      width: window.innerWidth
    })
  }
  _onChangeDiemDanh = (studying) => {
    const { classSchedule } = this.props;
    this.ajaxGet({
      url: `/api/teacher/ChangeRollCall?classScheduleId=${classSchedule.id}&studentId=${studying.student.id}`,
      success: (r) => {
        let rc = classSchedule.rollCalls.filter(
          (i) =>
            i.studentId == studying.student.id &&
            i.classScheduleId == classSchedule.id
        );
        if (rc.length > 0) {
          rc[0].isActive = r.data.isActive;
          rc[0].type = r.data.type;
        } else {
          classSchedule.rollCalls.push(r.data);
        }
        this.setState({}, () => {
          this.success(r.messages[0]);
        });
      },
      unsuccess: (r) => {
        this.error(r.messages[0]);
      },
    });
  };
  _closeClass = () => {
    const { classSchedule } = this.props;
    this.ajaxGet({
      url: `/api/class/closeClass?classScheduleId=${classSchedule.id}`,
      success: (r) => {
        classSchedule.status = r.data.status;
        classSchedule.endDatetime = r.data.endDatetime
        this.setState({}, () => {
          this.success(r.messages[0]);
        });
      },
      error: (r) => {
        this.error(r.messages[0]);
      },
    });
  };
  _onClickCloseClassBtn = () => {
    const a = window.confirm("Bạn chắc chắn muốn đóng lớp học này?");
    if (a) {
      this._closeClass();
    }
  };
  getImagePhone = (e) =>{
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let _self = this;
    let resize_width = 1080;

    reader.onload = function(event) {
      var img = document.createElement('img');
      img.src = event.target.result;
      img.name = event.target.name;
      img.size = event.target.size;
      let srcEncoded;
      img.onload = (el) => {
        var elem = document.createElement('canvas');
        var scaleFactor = resize_width / el.target.width;
        elem.width = resize_width;
        elem.height = el.target.height * scaleFactor;
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
        srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);
        _self.setState({imagePhone : srcEncoded}, ()=> _self._rollCall(_self.state.imagePhone));
      }

    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }
  renderBody() {
    const { classes, classSchedule } = this.props;
    const { review } = this.state;
    console.log("roll call");
    return (
      <Grid container style={{ overflowY: "auto" }}>
        {classSchedule.status != ClassStatus.closed ? (
          <Grid item xs={12}>
            
            {
              isMobileOrTablet() ? (
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <label style={{fontSize:"20px", border: "1px solid #F50057", borderRadius:"10px", marginTop:"15px"}}>Nhấn để <a>mở</a> máy ảnh</label>
                  <input type="file"
                        style={{opacity: 0,
                                position: "absolute"}}
                        name="image" 
                        accept="image/*" 
                        onChange={this.getImagePhone}
                        // capture="camera"
                        />
                </div>
              ) : (
                <GetImage
                  onGetImageCapture={this._onGetImageCapture}
                  onGetImageUpload={this._onGetImageUpload}
                />
              )
            }
          </Grid>
        ) : null}
        {classSchedule.status != ClassStatus.closed ? (
          <Grid item xs={12} className={classes.subTitleWrapper}>
            <Button
              onClick={this._onClickCloseClassBtn}
              color="secondary"
              variant="outlined"
              style={{ margin: "8px" }}
            >
              Đóng lớp
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={review}
                  onChange={() => {
                    this.setState({ review: !review });
                  }}
                />
              }
              label="Xem lại"
            />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {this.loadData ? (
            <RCSTable
              data={classSchedule.class.studyings}
              head={(Cell) => (
                <React.Fragment>
                  <Cell className={classes.centerCell}>Mã số sinh viên</Cell>
                  <Cell className={classes.centerCell}>Họ và tên</Cell>
                  <Cell className={classes.centerCell}>Điểm danh</Cell>
                  <Cell className={classes.centerCell}></Cell>
                </React.Fragment>
              )}
              body={(row, Cell) => {
                return (
                  <React.Fragment>
                    <Cell className={classes.centerCell}>{row.student.id}</Cell>
                    <Cell>{row.student.name}</Cell>
                    <Cell className={classes.centerCell}>
                      <Checkbox
                        checked={classSchedule.rollCalls.some(
                          (rc) => rc.studentId == row.student.id && rc.isActive
                        )}
                        onClick={() => {
                          this._onChangeDiemDanh(row);
                        }}
                      />
                    </Cell>
                    <Cell className={classes.centerCell}>
                      {classSchedule.rollCalls.some(
                        (rc) =>
                          rc.studentId == row.student.id 
                          && rc.imageId != null 
                          && rc.type == RollCallType.auto
                          && rc.isActive
                      ) ? (
                        <Image
                          imageId={
                            classSchedule.rollCalls.filter(
                              (rc) => rc.studentId == row.student.id
                            )[0].imageId
                          }
                          style={{ width: "36px", height: "36px", margin: "0" }}
                        />
                      ) : null}
                    </Cell>
                  </React.Fragment>
                );
              }}
            />
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles({
  title: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "uppercase",
  },
  subTitleWrapper: {
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  subTitle: {
    padding: "15px 30px 10px",
    textTransform: "capitalize",
    fontWeight: "normal",
  },
  image: {
    cursor: "pointer",
  },
  imageWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    margin: "0 8px",
  },
  centerCell: {
    textAlign: "center",
  },
})(RollCall);
