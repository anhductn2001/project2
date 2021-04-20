import React from "react";
import { withStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Typography, Button } from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import BaseComponent from "core/BaseComponent/BaseComponent";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import { ClassStatus } from "core/Enum";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardFooter from "components/Card/CardFooter";
import moment from "moment";
import { ClassStatusName } from "core/Enum";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import RollCall from "views/teacher/components/RollCall";
import { differenceInDays } from "date-fns";
import {
  QueryBuilder as QueryBuilderIcon,
  AlarmOn as AlarmOnIcon,
  RoomOutlined as RoomIcon,
} from "@material-ui/icons";

class ScheduleTeachPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      classesOfTeacher: [],
      date: new Date(),
    };
    this.teacherId = sensitiveStorage.getTeacherId();
  }
  _getAllClassOfTeacher = () => {
    const data = {
      teacherId: this.teacherId,
      date: this.state.date,
    };
    this.ajaxPost({
      url: `/api/teacher/GetAllClassByTeacherId`,
      data: data,
      success: (r) => {
        this.setState({ classesOfTeacher: r.data });
      },
      unsuccess: (r) => {
        console.log(r.messages[0]);
      },
    });
  };
  _openClass = (classSchedule) => {
    this.ajaxGet({
      url: `/api/class/openClass?classScheduleId=${classSchedule.id}`,
      success: (r) => {
        this._openClassRollCall(classSchedule);
      },
      unsuccess: (r) => {
        this.error(r.messages[0]);
      },
    });
  };
  _onClickClassInDateBtn = (classSchedule) => {
    if (classSchedule.status == ClassStatus.schedule) {
      const a = window.confirm("Bạn chắc chắn muốn mở lớp học này?");
      if (a) this._openClass(classSchedule);
    } else this._openClassRollCall(classSchedule);
  };
  _openClassRollCall = (classSchedule) => {
    this.openModal({
      content: <RollCall classSchedule={classSchedule} />,
      title: "Điểm danh",
      fullScreen: true,
    });
  };
  componentDidMount() {
    this._getAllClassOfTeacher();
  }
  _onChangeDate = (date) => {
    this.setState({ date: date }, () => {
      this._getAllClassOfTeacher();
    });
  };
  renderBody() {
    const { classesOfTeacher, date } = this.state;
    const { classes } = this.props;
    var classInDate = 0;
    return (
      <div>
        <Card profile style={{ marginTop: 0 }}>
          <CardHeader color="primary" className={classes.header}>
            <Typography variant="h5">Lớp học trong ngày</Typography>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem
                xs={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Chọn ngày"
                    format="dd/MM/yyyy"
                    value={date}
                    onChange={this._onChangeDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    autoComplete
                    inputProps={{
                      style: { textAlign: "center" },
                    }}
                    color="secondary"
                    inputVariant="outlined"
                    variant="inline"
                  />
                </MuiPickersUtilsProvider>
              </GridItem>
              {classesOfTeacher.map((c) => {
                return c.classSchedules.map((cs) => {
                  classInDate++;
                  const color =
                    cs.status == ClassStatus.schedule
                      ? "info"
                      : cs.status == ClassStatus.opening
                      ? "warning"
                      : "success";
                  return (
                    <GridItem
                      xs={12}
                      sm={6}
                      md={4}
                      xl={3}
                      key={`${cs.classId}${cs.datetime}`}
                    >
                      <Card>
                        <CardHeader color={color} stats icon>
                          <CardIcon color={color}>
                            <Typography variant="h6">
                              {moment(cs.datetime).format("HH:mm")}
                            </Typography>
                          </CardIcon>
                        </CardHeader>
                        <GridContainer
                          style={{ padding: "10px", textAlign: "left" }}
                        >
                          <GridItem xs={12}>
                            <Typography variant="h6">
                              {c.subject.name}
                            </Typography>
                          </GridItem>
                          <GridItem xs={12}>
                            <Typography
                              variant="body1"
                              className={classes.body1}
                            >
                              <RoomIcon className={classes.icon} /> {c.room}
                            </Typography>
                          </GridItem>
                          <GridItem xs={6}>
                            <Typography
                              variant="body1"
                              className={classes.body1}
                            >
                              <QueryBuilderIcon className={classes.icon} />
                              {cs.status != ClassStatus.schedule
                                ? moment(cs.startDatetime).format("HH:mm")
                                : "_____"}
                            </Typography>
                          </GridItem>
                          <GridItem xs={6}>
                            <Typography
                              variant="body1"
                              className={classes.body1}
                            >
                              <AlarmOnIcon className={classes.icon} />
                              {cs.status == ClassStatus.closed
                                ? moment(cs.endDatetime).format("HH:mm")
                                : "_____"}
                            </Typography>
                          </GridItem>
                        </GridContainer>
                        <CardFooter stats>
                          <Button
                            onClick={() => {
                              this._onClickClassInDateBtn(cs);
                            }}
                            color="primary"
                          >
                            {cs.status == ClassStatus.schedule
                              ? "Mở lớp"
                              : cs.status == ClassStatus.opening
                              ? "Tham gia lớp học"
                              : "Xem chi tiết"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </GridItem>
                  );
                });
              })}
              {classInDate == 0 ? (
                <Typography
                  variant="body1"
                  style={{ fontStyle: "italic", padding: "0 10px" }}
                >
                  Hôm nay bạn không có lớp học.
                </Typography>
              ) : null}
            </GridContainer>
          </CardBody>
        </Card>
      </div>
    );
  }
}
const styleLocal = {
  card: {
    cursor: "pointer",
  },
  paddingCardContent: {
    padding: "5px",
  },
  hover: {
    cursor: "pointer",
  },
  celCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body1: {
    display: "flex",
    flex: "row",
    alignItems: "center",
    fontSize: "1.1rem",
    margin: "6px 4px",
  },
  icon: { marginRight: "4px" },
};
export default withStyles(styleLocal)(ScheduleTeachPage);
