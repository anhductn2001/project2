import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { Typography, TextField, Grid } from "@material-ui/core";
import maleAvatar from "assets/img/male-avatar-default.jpg";
import femaleAvatar from "assets/img/female-avatar-default.jpg";
import {Gender} from '../../../core/Enum';
import moment from "moment";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

class TeacherInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      teacher: {
        id: "",
        name: "",
        address: "",
        email: "",
        phoneNumber: "",
        birthday: new Date(),
        hometown: "",
        gender: 1,
        faculty: {
          name: "",
        },
      },
    };
    this.teacherId = sensitiveStorage.getTeacherId();
  }
  _getTeacherInfo = () => {
    this.ajaxGet({
      url: `/api/teacher/GetTeacherInfo?teacherId=${this.teacherId}`,
      success: (r) => {
        this.setState({ teacher: r.data });
      },
      unsuccess: (r) => {
        console.log(r.messages[0]);
      },
    });
  };
  componentDidMount() {
    this._getTeacherInfo();
  }
  renderBody() {
    let { teacher } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={4} style={{ flexWrap: "wrap-reverse" }}>
          <Grid item xs={12} md={8}>
            <Card profile style={{ marginTop: 0 }}>
              <CardHeader color="primary">
                <Typography
                  variant="h5"
                  style={{ color: "#fff", textAlign: "left" }}
                >
                  Hồ sơ
                </Typography>
              </CardHeader>
              <CardBody style={{ padding: "25px 20px 30px" }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      value={teacher.email}
                      label="Email"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={teacher.phoneNumber}
                      label="Số điện thoại"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={teacher.hometown}
                      label="Quê quán"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={teacher.address}
                      label="Nơi hiện tại"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={teacher.faculty.name}
                      label="Thuộc khoa"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ marginTop: 0 }}>
              <CardAvatar profile style={{ margin: "-20px auto 0" }}>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img
                    src={
                      teacher.gender == Gender.male ? maleAvatar : femaleAvatar
                    }
                    alt="..."
                  />
                </a>
              </CardAvatar>
              <CardBody profile>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      value={teacher.id}
                      label="Mã số giáo viên"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={teacher.name}
                      label="Họ và tên"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={moment(teacher.birthday).format("DD/MM/YYYY")}
                      label="Ngày sinh"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
                {/* <Button color="primary" round>
                Hello
              </Button> */}
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(TeacherInfo);
