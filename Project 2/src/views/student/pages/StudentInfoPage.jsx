import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { withStyles, TextField, Grid, Typography } from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CardAvatar from "components/Card/CardAvatar";
import maleAvatar from "assets/img/male-avatar-default.jpg";
import femaleAvatar from "assets/img/female-avatar-default.jpg";
import { Gender } from "core/Enum";
import TrainingFace from "views/student/components/TrainingFace";
import moment from "moment";

class InfoPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      student: {
        id: "",
        name: "",
        address: "",
        email: "",
        phoneNumber: "",
        birthday: new Date(),
        hometown: "",
        course: {
          name: "",
        },
        major: {
          name: "",
          faculty: {
            name: "",
          },
        },
        majorSpecialty: {
          name: "",
        },
        gender: 1,
        trainingImages: [],
      },
    };
    this.studentId = sensitiveStorage.getStudentId();
  }
  _getStudentInfo = () => {
    this.ajaxGet({
      url: `/api/student/GetStudentInfo?studentId=${this.studentId}`,
      success: (apiResult) => {
        this.setState({ student: apiResult.data });
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
      student: {
        id: "",
        name: "",
        address: "",
        email: "",
        phoneNumber: "",
        birthday: new Date(),
        hometown: "",
        course: {
          name: "",
        },
        major: {
          name: "",
          faculty: {
            name: "",
          },
        },
        majorSpecialty: {
          name: "",
        },
        gender: 1,
        trainingImages: [],
      },
    })
  }
  renderBody() {
    const { student } = this.state;
    console.log("student information page");
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
                  H??? s??
                </Typography>
              </CardHeader>
              <CardBody style={{ padding: "25px 20px 30px" }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      value={student.email}
                      label="Email"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={student.phoneNumber}
                      label="S??? ??i???n tho???i"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={student.hometown}
                      label="Qu?? qu??n"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={student.address}
                      label="N??i hi???n t???i"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={student.major.faculty.name}
                      label="Thu???c khoa"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={student.course.name}
                      label="Kh??a h???c"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={student.major.name}
                      label="Ng??nh h???c"
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={student.majorSpecialty.name}
                      label="Chuy??n ng??nh"
                      variant="outlined"
                      required
                      fullWidth
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
                      student.gender == Gender.male ? maleAvatar : femaleAvatar
                    }
                    alt="..."
                  />
                </a>
              </CardAvatar>
              <CardBody profile>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      value={student.id}
                      label="M?? s??? sinh vi??n"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={student.name}
                      label="H??? v?? t??n"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={moment(student.birthday).format("DD/MM/YYYY")}
                      label="Ng??y sinh"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles({})(InfoPage);
