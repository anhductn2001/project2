import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import imageBackground from "assets/img/login.png";
import { UserRole } from "core/Enum";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Roll Call System
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = (theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${imageBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false,
      errorMessage: "",
      isRemember: false,
    };
  }
  componentDidMount() {
    document.addEventListener("keypress", this.handleKeyEnter);
    this._checkLogin();
  }
  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeyEnter);
  }
  handleKeyEnter = (e) => {
    const { username, password, isRemember } = this.state;
    if (username != "" && password != "" && e.keyCode == 13) {
      this._onClickLogin();
    }
  };
  _error = (message) => {
    if (typeof message == "string") {
      this.setState({
        error: true,
        errorMessage: message,
      });
    } else {
      this.setState({
        error: false,
        errorMessage: "",
      });
    }
  };
  _onClickLogin = () => {
    console.log("login");
    const { username, password, isRemember } = this.state;
    if (username == "" || password == "") {
      this._error("username và password không được để trống!");
      return;
    }
    let loginInfor = {
      username: username,
      password: password,
      isRemember: isRemember,
    };
    this.ajaxPost({
      url: "/api/account/login",
      data: loginInfor,
      blockUI: true,
      success: (apiResult) => {
        this.login(apiResult);
      },
      unsuccess: (apiResult) => {
        this.error(apiResult.messages[0]);
      },
    });
  };
  _hanldeOnchangeUserName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  _hanldeOnChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  _hanledRemember = (e) => {
    this.setState({
      isRemember: !this.state.isRemember,
    });
  };
  _checkLogin = () => {
    const userId = sensitiveStorage.getUserId();
    const userRole = sensitiveStorage.getUserRole();
    if (userId && userRole == UserRole.teacher) {
      this.goTo("/teacher/teaching-schedule");
    } else if (userId && userRole == UserRole.student) {
      this.goTo("/student/subject");
    } else {
      sensitiveStorage.removeUserId();
      sensitiveStorage.removeUserRole();
      sensitiveStorage.removeStudentId();
      sensitiveStorage.removeTeacherId();
    }
  };
  renderBody() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng nhập
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Tài khoản"
                name="username"
                autoComplete="email"
                value={this.state.username}
                onChange={(e) => this._hanldeOnchangeUserName(e)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={(e) => this._hanldeOnChangePassword(e)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value={this.state.isRemember}
                    onChange={(e) => this._hanledRemember(e)}
                    color="primary"
                  />
                }
                label="Ghi nhớ"
              />
              {this.state.error ? (
                <Typography color="error">{this.state.errorMessage}</Typography>
              ) : null}
              <Button
                onClick={this._onClickLogin}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Đăng nhập
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Quên mật khẩu ?
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}
export default withRouter(withStyles(useStyles)(Login));
