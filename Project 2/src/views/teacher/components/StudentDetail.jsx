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
import { DayOfWeek } from "core/Enum";
import RCSTable from "views/general/RCSTable";
import moment from "moment";
import { ClassStatus } from "core/Enum";
import { ClassStatusName } from "core/Enum";
import GridContainer from "components/Grid/GridContainer";
import { OpenInNew as OpenIcon } from "@material-ui/icons";

class StudentDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.teacherId = sensitiveStorage.getTeacherId();
  }
  _onChangeDiemDanh = (classSchedule) => {
    const { classOfTeacher, studentId } = this.props;
    this.ajaxGet({
      url: `/api/teacher/ChangeRollCall?classScheduleId=${classSchedule.id}&studentId=${studentId}`,
      success: (r) => {
        classOfTeacher.classSchedules.forEach((cs) => {
          if (cs.id == classSchedule.id) {
            let rc = cs.rollCalls.filter(
              (i) =>
                i.studentId == studentId &&
                i.classScheduleId == classSchedule.id
            );
            if (rc.length > 0) {
              rc[0].isActive = r.data.isActive;
            } else {
              cs.rollCalls.push(r.data);
            }
          }
        });
        this.setState({});
        this.success(r.messages[0]);
      },
      unsuccess: (r) => {
        this.error(r.messages[0]);
      },
    });
  };
  renderBody() {
    const { classOfTeacher, studentId } = this.props;
    const { classes } = this.props;
    const sobuoidahoc = classOfTeacher.classSchedules.filter((cs) => {
      return cs.status != ClassStatus.schedule;
    }).length;
    const sobuoidihoc = classOfTeacher.classSchedules.filter(
      (cs) =>
        cs.status != ClassStatus.schedule &&
        cs.rollCalls.some((rc) => rc.studentId == studentId && rc.isActive)
    ).length;
    console.log("student detail");
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={12}>
              <FormLabel>
                Tổng số buổi: {classOfTeacher.classSchedules.length}
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
            data={classOfTeacher.classSchedules}
            head={(Cell) => (
              <React.Fragment>
                <Cell>Ngày học</Cell>
                <Cell>Trạng thái</Cell>
                <Cell>Thời gian bắt đầu</Cell>
                <Cell>Thời gian kết thúc</Cell>
                <Cell>Điểm danh</Cell>
              </React.Fragment>
            )}
            body={(row, Cell) => (
              <React.Fragment>
                <Cell>{moment(row.datetime).format("DD/MM/yyyy")}</Cell>
                <Cell>{ClassStatusName[row.status]}</Cell>
                <Cell>
                  {row.startDatetime
                    ? moment(row.startDatetime).format("HH:mm")
                    : null}
                </Cell>
                <Cell>
                  {row.endDatetime
                    ? moment(row.endDatetime).format("HH:mm")
                    : null}
                </Cell>
                <Cell className={classes.celCenter}>
                  <Checkbox
                    checked={row.rollCalls.some(
                      (rc) => rc.studentId == studentId && rc.isActive
                    )}
                    onClick={() => {
                      this._onChangeDiemDanh(row);
                    }}
                  />
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
})(StudentDetail);
