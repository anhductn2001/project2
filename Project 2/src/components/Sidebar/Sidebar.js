/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import NavbarLinks from "components/Navbars/NavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";
import { Link } from 'react-router-dom';
import BaseComponent from "core/BaseComponent/BaseComponent";
import $ from "jquery";

const useStyles = makeStyles(styles);

class Sidebar extends BaseComponent {
  constructor(props) {
    super(props);
  }
  _activeRoute = (routeName) => {
    let path = routeName.split(":");
    return window.location.href.indexOf(path[0]) > -1 ? true : false;
  }
  _onClickListItem = (small) => {
    if (small) {
      this.props.handleDrawerToggle();
    }
  }
  _links = (small = false) => {
    const { color, routes, classes } = this.props;
    return (
      <List className={classes.list}>
        {routes.map((prop, key) => {
          let listItemClasses = classNames({
            [" " + classes[color]]: this._activeRoute(prop.layout + prop.path)
          });
          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: this._activeRoute(prop.layout + prop.path)
          });
          return (
            <NavLink
              to={prop.layout + prop.path}
              className={classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button className={classes.itemLink + listItemClasses} onClick={() => { this._onClickListItem(small) }}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                    <prop.icon
                      className={classNames(classes.itemIcon, whiteFontClasses)}
                    />
                  )}
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        })}
      </List>
    );
  }
  _brand = () => {
    const { logo, logoText, classes } = this.props;
    return (
      <div className={classes.logo}>
        <Link
          to="/admin/dashboard"
          className={classes.logoLink}
        >
          <div className={classes.logoImage}>
            <img src={logo} alt="logo" className={classes.img} />
          </div>
          <div style={{ float: "right" }}>
            {logoText}
          </div>

        </Link>
      </div>
    );
  }
  renderBody() {
    const { color, image, classes, handleDrawerToggle, open } = this.props;
    return (
      <div>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"right"}
            open={open}
            classes={{ paper: classes.drawerPaper }}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {this._brand()}
            <div className={classes.sidebarWrapper}>
              {this._links(true)}
              <NavbarLinks />
            </div>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            anchor={"left"}
            variant="permanent"
            open
            classes={{ paper: classes.drawerPaper }}
          >
            {this._brand()}
            <div className={classes.sidebarWrapper}>
              {this._links()}
            </div>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool
};

export default withStyles(styles)(Sidebar);
