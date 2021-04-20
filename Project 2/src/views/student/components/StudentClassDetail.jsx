import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
  TextField,
  Checkbox,
  FormLabel,
} from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import RCSTable from "views/general/RCSTable";
import moment from "moment";
import {
  ClassStatus,
  ClassStatusName,
  RollCallType,
  DayOfWeek,
} from "core/Enum";
import Image from "views/general/Image";

class StudentClassDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.studentId = sensitiveStorage.getStudentId();
  }
  renderBody() {
    const { classes, studying } = this.props;
    const sobuoidahoc = studying.class.classSchedules.filter((cs) => {
      return cs.status != ClassStatus.schedule;
    }).length;
    const sobuoidihoc = studying.class.classSchedules.filter(
      (cs) =>
        cs.status != ClassStatus.schedule &&
        cs.rollCalls.some((rc) => rc.studentId == this.studentId && rc.isActive)
    ).length;
    console.log("student subject detail");
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={6}>
              <FormLabel>Giảng viên: {studying.class.teacher.name}</FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>
                Thời gian:{" "}
                {`${DayOfWeek[studying.class.day]} (${
                  studying.class.startSession
                }-${studying.class.startSession +
                  studying.class.quantityOfSession -
                  1})`}
              </FormLabel>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>
                Tổng số buổi: {studying.class.classSchedules.length}
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Đi học: {sobuoidihoc}</FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Vắng mặt: {sobuoidahoc - sobuoidihoc}</FormLabel>
            </Grid>
          </Grid>
          <RCSTable
            data={studying.class.classSchedules}
            head={(Cell) => (
              <React.Fragment>
                <Cell className={classes.centerCell}>Ngày học</Cell>
                <Cell className={classes.centerCell}>Trạng thái</Cell>
                <Cell className={classes.centerCell}>Thời gian bắt đầu</Cell>
                <Cell className={classes.centerCell}>Thời gian kết thúc</Cell>
                <Cell className={classes.centerCell}>Điểm danh</Cell>
                <Cell className={classes.centerCell}></Cell>
              </React.Fragment>
            )}
            body={(row, Cell) => (
              <React.Fragment>
                <Cell className={classes.centerCell}>
                  {moment(row.datetime).format("DD/MM/yyyy")}
                </Cell>
                <Cell className={classes.centerCell}>
                  {ClassStatusName[row.status]}
                </Cell>
                <Cell className={classes.centerCell}>
                  {row.startDatetime
                    ? moment(row.startDatetime).format("HH:mm")
                    : null}
                </Cell>
                <Cell className={classes.centerCell}>
                  {row.endDatetime
                    ? moment(row.endDatetime).format("HH:mm")
                    : null}
                </Cell>
                <Cell className={classes.centerCell}>
                  <Checkbox
                    disabled
                    checked={row.rollCalls.some((rc) => rc.isActive)}
                  />
                </Cell>
                <Cell className={classes.centerCell}>
                  {row.rollCalls.length > 0 &&
                  row.rollCalls[0].type == RollCallType.auto ? (
                    <Image
                      imageId={row.rollCalls[0].imageId}
                      style={{ width: "36px", height: "36px", margin: "0" }}
                    />
                  ) : null}
                </Cell>
              </React.Fragment>
            )}
          />
        </div>
      </div>
    );
  }
}

export default withStyles({
  root: {},
  title: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "uppercase",
  },
  content: {
    padding: "10px 15px",
  },
  centerCell: {
    textAlign: "center",
  },
})(StudentClassDetail);
