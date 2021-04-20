import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { withStyles, IconButton, Typography } from "@material-ui/core";
import RCSTable from "views/general/RCSTable";
import { OpenInNew as OpenIcon } from "@material-ui/icons";
import { DayOfWeek } from "core/Enum";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import StudentClassDetail from "views/student/components/StudentClassDetail";
import CardHeader from "components/Card/CardHeader";

class SubjectPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      studyings: [],
    };
    this.studentId = sensitiveStorage.getStudentId();
    this.count = 0;
  }
  _getClassOfStudent = () => {
    this.ajaxGet({
      url: `/api/student/GetAllSubject?studentId=${this.studentId}`,
      success: (apiResult) => {
        this.setState({ studyings: apiResult.data });
      },
      unsuccess: (apiResult) => {
        console.error(apiResult.messages[0]);
      },
    });
  };
  _onClickDetailBtn = (studying) => {
    this.openModal({
      content: <StudentClassDetail studying={studying} />,
      title: studying.class.subject.name,
    });
  };
  componentDidMount() {
    this._getClassOfStudent();
  }
  componentWillUnmount() {
    this.setState({
      studyings: [],
    });
  }
  renderBody() {
    const { classes } = this.props;
    const { studyings } = this.state;
    this.count++;
    console.log("subject page", this.count);
    return (
      <Card profile style={{ marginTop: 0 }}>
        <CardHeader color="primary" className={classes.header}>
          <Typography variant="h5">Môn học đã đăng ký</Typography>
        </CardHeader>
        <CardBody style={{ padding: "25px 20px 30px" }}>
          <RCSTable
            emptyText="Bạn chưa đăng ký môn học nào cả"
            data={studyings}
            head={(Cell) => (
              <React.Fragment>
                <Cell className={classes.centerCell}>Mã môn học</Cell>
                <Cell className={classes.centerCell}>Tên môn học</Cell>
                <Cell className={classes.centerCell}>Lớp học</Cell>
                <Cell className={classes.centerCell}>Ngày học</Cell>
                <Cell className={classes.centerCell}>Xem chi tiết</Cell>
              </React.Fragment>
            )}
            body={(row, Cell) => (
              <React.Fragment>
                <Cell className={classes.centerCell}>
                  {row.class.subject.id}
                </Cell>
                <Cell>{row.class.subject.name}</Cell>
                <Cell className={classes.centerCell}>{row.class.name}</Cell>
                <Cell className={classes.centerCell}>
                  {DayOfWeek[row.class.day]}
                </Cell>
                <Cell className={classes.centerCell}>
                  <IconButton
                    onClick={() => {
                      this._onClickDetailBtn(row);
                    }}
                  >
                    <OpenIcon />
                  </IconButton>
                </Cell>
              </React.Fragment>
            )}
          />
        </CardBody>
      </Card>
    );
  }
}

export default withStyles({
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
  centerCell: {
    textAlign: "center",
  },
})(SubjectPage);
