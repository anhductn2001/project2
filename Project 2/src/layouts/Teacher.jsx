import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { withStyles } from "@material-ui/core";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { teacherRoutes } from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo-khtn.png";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { UserRole } from "core/Enum";

let ps;
class Teacher extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: bgImage,
      color: "blue",
      fixedClasses: "dropdown",
      mobileOpen: false,
      nowClass: null,
    };
    this.mainPanel = React.createRef();
    this.dashboardRef = React.createRef();
    this.userId = sensitiveStorage.getUserId();
    this.userRole = sensitiveStorage.getUserRole();
  }

  _checkUser = () => {
    return this.userId && this.userRole == UserRole.teacher;
  };

  switchRoutes = () => {
    return (
      <Switch>
        {this._checkUser() ? (
          <React.Fragment>
            {teacherRoutes.map((prop, key) => {
              let Component = prop.component;
              return (
                <Route
                  path={prop.layout + prop.path}
                  render={(props) => (
                    <Component
                      {...props}
                      ref={
                        prop.path == "/teaching-schedule"
                          ? this.dashboardRef
                          : null
                      }
                      nowClass={this.state.nowClass}
                      updateNowClass={this.updateNowClass}
                      color={this.state.color}
                    />
                  )}
                  key={key}
                />
              );
            })}
          </React.Fragment>
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )}
      </Switch>
    );
  };

  handleImageClick = (image) => {
    this.setState({
      image: image,
    });
  };
  handleColorClick = (color) => {
    this.setState({
      color: color,
    });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({
        fixedClasses: "dropdown show",
      });
    } else {
      this.setState({
        fixedClasses: "dropdown",
      });
    }
  };
  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({
        mobileOpen: false,
      });
    }
  };
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
    let self = this;
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", self.resizeFunction);
    };
  }
  updateNowClass = () => {};
  renderBody() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={teacherRoutes}
          logoText={"Roll Call System"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          // {...rest}
        />
        <div className={classes.mainPanel} ref={this.mainPanel}>
          <Navbar
            routes={teacherRoutes}
            nowClass={this.state.nowClass}
            updateNowClass={this.updateNowClass}
            handleDrawerToggle={this.handleDrawerToggle}
          />
          <div className={classes.content}>
            <div className={classes.container}>{this.switchRoutes()}</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Teacher);
