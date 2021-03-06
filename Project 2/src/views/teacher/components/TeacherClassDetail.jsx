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
import StudentDetail from "views/teacher/components/StudentDetail";
import { Parser } from 'json2csv';
import FileSaver from 'file-saver';

class TeacherClassDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      classOfTeacher: this.props.classOfTeacher,
    };
    this.teacherId = sensitiveStorage.getTeacherId();
    this.loadDataSuccess = false;
  }
  _getClass = () => {
    this.ajaxGet({
      url: `/api/teacher/GetClass?classId=${this.state.classOfTeacher.id}`,
      success: (r) => {
        this.loadDataSuccess = true;
        this.setState({ classOfTeacher: r.data });
      },
      unsuccess: (r) => {
        console.log(r.messages[0]);
      },
    });
  };
  componentDidMount() {
    this._getClass();
  }
  _onClickStudentDetail = (studying) => {
    const { classOfTeacher } = this.state;
    this.openModal({
      content: (
        <StudentDetail
          classOfTeacher={classOfTeacher}
          studentId={studying.student.id}
        />
      ),
      title: `${studying.student.id} - ${studying.student.name}`,
    });
  };
  _getDataExcel = () =>{
    const { classOfTeacher } = this.state;
    const sobuoidahoc = classOfTeacher.classSchedules.filter((cs) => {
      return cs.status != ClassStatus.schedule;
    }).length;
    return classOfTeacher.studyings.map((row,index)=>{
      var sobuoidiemdanh = 0;
      classOfTeacher.classSchedules.forEach((cs) => {
        if (
          cs.rollCalls.some(
            (rc) => rc.studentId == row.student.id && rc.isActive
          )
        )
          sobuoidiemdanh++;
      });
      return {
        "STT": index,
        "M?? s??? sinh vi??n": row.student.id,
        "H??? v?? t??n": row.student.name,
        "S??? bu???i h???c": sobuoidiemdanh,
        "S??? bu???i v???ng": sobuoidahoc - sobuoidiemdanh
      }
    })
  }
  _exportExcel = () =>{
    const parser = new Parser(); //new Parse
    const csv = parser.parse(this._getDataExcel());
    const blob = new Blob([csv], {type: "data:text/csv;charset=utf-8,"}); 
    FileSaver.saveAs(blob, "??i???m danh " + this.state.classOfTeacher.subject.name + '.csv'); 
  }
  renderBody() {
    const { classOfTeacher } = this.state;
    const { classes } = this.props;
    const sobuoidahoc = classOfTeacher.classSchedules.filter((cs) => {
      return cs.status != ClassStatus.schedule;
    }).length;
    console.log("teacher class detail");
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={6}>
              <FormLabel>
                Th???i gian:{" "}
                {`${DayOfWeek[classOfTeacher.day]} (${
                  classOfTeacher.startSession
                }-${classOfTeacher.startSession +
                  classOfTeacher.quantityOfSession -
                  1})`}
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>
                S??? sinh vi??n: {classOfTeacher.studyings.length}
              </FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Ph??ng h???c: {classOfTeacher.room}</FormLabel>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>
                S??? bu???i ???? h???c:{" "}
                {
                  classOfTeacher.classSchedules.filter(
                    (i) => i.status == ClassStatus.closed
                  ).length
                }
                /{classOfTeacher.classSchedules.length}
              </FormLabel>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={this._exportExcel}>Xu???t file b??o c??o</Button>
            </Grid>
          </Grid>
          {this.loadDataSuccess ? (
            <RCSTable
              data={classOfTeacher.studyings}
              head={(Cell) => (
                <React.Fragment>
                  <Cell>M?? s??? sinh vi??n</Cell>
                  <Cell>H??? v?? t??n</Cell>
                  <Cell>S??? bu???i h???c</Cell>
                  <Cell>S??? bu???i v???ng</Cell>
                  <Cell>Chi Ti???t</Cell>
                </React.Fragment>
              )}
              body={(row, Cell) => {
                var sobuoidiemdanh = 0;
                classOfTeacher.classSchedules.forEach((cs) => {
                  if (
                    cs.rollCalls.some(
                      (rc) => rc.studentId == row.student.id && rc.isActive
                    )
                  )
                    sobuoidiemdanh++;
                });
                return (
                  <React.Fragment>
                    <Cell>{row.student.id}</Cell>
                    <Cell>{row.student.name}</Cell>
                    <Cell>{sobuoidiemdanh}</Cell>
                    <Cell>{sobuoidahoc - sobuoidiemdanh}</Cell>
                    <Cell className={classes.celCenter}>
                      <IconButton
                        onClick={() => {
                          this._onClickStudentDetail(row);
                        }}
                      >
                        <OpenIcon />
                      </IconButton>
                    </Cell>
                  </React.Fragment>
                );
              }}
            />
          ) : (
            "Kh??ng th??? t???i d??? li???u"
          )}
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
})(TeacherClassDetail);
