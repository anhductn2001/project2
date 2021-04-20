import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import { withRouter, Redirect } from "react-router-dom";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import BaseComponent from '../../core/BaseComponent/BaseComponent';

const useStyles = makeStyles(styles);

class NavbarLinks extends BaseComponent {
  //const classes = useStyles();
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  _hanldeLogout = () => {
    const ok = window.confirm("Bạn muốn đăng xuất?");
    if (ok) {
      this.logout();
    }
  }
  renderBody() {
    const { classes } = this.props;
    return (
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={this.state.openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={this._hanldeLogout}
          className={classes.buttonLink}
        >
          <ExitToAppIcon style={{ width: "24px", height: "30px" }} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Đăng xuất</p>
          </Hidden>
        </Button>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(NavbarLinks));