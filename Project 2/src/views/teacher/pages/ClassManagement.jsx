import React from "react";
import { withStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Typography, IconButton } from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import BaseComponent from "core/BaseComponent/BaseComponent";
import RCSTable from "views/general/RCSTable";
import { OpenInNew as OpenIcon } from "@material-ui/icons";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import { DayOfWeek } from "core/Enum";
import CardHeader from "components/Card/CardHeader";
import TeacherClassDetail from "views/teacher/components/TeacherClassDetail";
import { isMobile, isMobileOrTablet } from "core/Helper";

class ClassManagement extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      classesOfTeacher: [],
    };
    this.teacherId = sensitiveStorage.getTeacherId();
  }
  _getAllClassOfTeacher = () => {
    const data = {
      teacherId: this.teacherId
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
  _onClickClassDetailBtn = (classOfTeacher) => {
    this.openModal({
      content: <TeacherClassDetail classOfTeacher={classOfTeacher} />,
      title: `${classOfTeacher.name} - ${classOfTeacher.subject.name}`,
      fullScreen: true,
    });
  };
  componentDidMount() {
    this._getAllClassOfTeacher();
  }
  renderBody() {
    const { classesOfTeacher } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Card profile style={{ marginTop: 0 }}>
          <CardHeader color="primary" className={classes.header}>
            <Typography variant="h5">Lớp đang phụ trách</Typography>
          </CardHeader>
          <CardBody style={{ padding: "25px 20px 30px" }}>
            <RCSTable
              data={classesOfTeacher}
              emptyText={"Bạn không có lịch dạy nào trong tuần."}
              head={(Cell) => (
                <React.Fragment>
                  {isMobile() ? null : (
                    <Cell className={classes.centerCell}>Mã Môn</Cell>
                  )}
                  <Cell className={classes.centerCell}>Tên Môn</Cell>
                  <Cell className={classes.centerCell}>Lớp</Cell>
                  <Cell className={classes.centerCell}>Thời gian</Cell>
                  <Cell className={classes.centerCell}>Chi tiết</Cell>
                </React.Fragment>
              )}
              body={(row, Cell) => (
                <React.Fragment>
                  {isMobile() ? null : (
                    <Cell className={classes.centerCell}>{row.subject.id}</Cell>
                  )}
                  <Cell>{row.subject.name}</Cell>
                  <Cell className={classes.centerCell}>{row.name}</Cell>
                  <Cell className={classes.centerCell}>{`${
                    DayOfWeek[row.day]
                  } (${row.startSession}-${row.startSession +
                    row.quantityOfSession -
                    1})`}</Cell>
                  <Cell className={classes.centerCell}>
                    <IconButton
                      onClick={() => {
                        this._onClickClassDetailBtn(row);
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
  centerCell: {
    textAlign: "center",
  },
};
export default withStyles(styleLocal)(ClassManagement);
