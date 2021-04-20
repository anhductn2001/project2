import React from "react";
import { sensitiveStorage } from "../services/SensitiveStorage";
// import { css } from "@emotion/core";
import moment from "moment";
// import Modal from '@material-ui/core/Modal';
// import Fade from '@material-ui/core/Fade';
import CustomModal from "components/Modal/CustomModal";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import Configs from "app.config";
import { UserRole } from "core/Enum";
import AlertifyManager from "components/AlertifyManager/AlertifyManager";
import Loading from "components/Loading/Loading";

class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.modal = {};
    let _self = this;
    this._alertifyManagerRef = React.createRef();
    this._blockUiRef = React.createRef();
    this.render = () => {
      return (
        <>
          <Loading innerRef={this._blockUiRef} />
          <CustomModal onClose={this.closeModal} {..._self.state.modal} />
          <AlertifyManager innerRef={this._alertifyManagerRef} />
          {this.renderBody()}
        </>
      );
    };
  }
  blockUi = () => {
    this._blockUiRef.current && this._blockUiRef.current.open();
  };
  unBlockUi = () => {
    this._blockUiRef.current && this._blockUiRef.current.close();
  };
  renderBody() {
    throw "method render body must be override";
  }
  closeModal = () => {
    this.setState({ modal: { open: false } });
  };
  openModal = (option) => {
    this.setState({ modal: { open: true, ...option } });
  };
  renderBodyModal() {
    return <div>testing</div>;
  }
  goTo = (url, param = "") => {
    this.props.history.push({
      pathname: url,
      state: param,
    });
  };
  login = (apiResult) => {
    const user = apiResult.data;
    if (user.role == UserRole.teacher) {
      sensitiveStorage.setUserId(user.id);
      sensitiveStorage.setUserRole(user.role);
      sensitiveStorage.setTeacherId(user.teacher.id);
      this.goTo("/teacher/teaching-schedule");
    } else if (user.role == UserRole.student) {
      sensitiveStorage.setUserId(user.id);
      sensitiveStorage.setUserRole(user.role);
      sensitiveStorage.setStudentId(user.student.id);
      this.goTo("/student/subject");
    } else this._error("Bạn không thể đăng nhâp vào hệ thống.");
  };
  logout = () => {
    sensitiveStorage.removeUserId();
    sensitiveStorage.removeUserRole();
    sensitiveStorage.removeStudentId();
    sensitiveStorage.removeTeacherId();
    this.goTo("/login");
  };
  validateApi = (response) => {
    if (response.data.isSuccess) {
      return true;
    }
    return false;
  };
  updateStateLoader = (status) => {
    this.setState({
      statusLoader: status,
    });
  };
  success(content) {
    this._alertifyManagerRef.current &&
      this._alertifyManagerRef.current.addNewAlertify(content, "success");
  }
  warning(content) {
    this._alertifyManagerRef.current &&
      this._alertifyManagerRef.current.addNewAlertify(content, "warning");
  }
  error(content) {
    this._alertifyManagerRef.current &&
      this._alertifyManagerRef.current.addNewAlertify(content, "error");
  }
  getUserId() {
    return sensitiveStorage.getUserId();
  }
  formatDateTime = (value, formatType = "DD/MM/YYYY") => {
    return moment(value).format(formatType);
  };
  getDate() {
    let nowDate = new Date();
    return `${nowDate.getFullYear()}-${nowDate.getMonth() +
      1}-${nowDate.getDate()}`;
  }
  _sendAjax = (_method, params) => {
    let _self = this;
    if (!params.url) {
      throw "expected `url` parameter";
    }
    // const baseUrl = window.applicationBaseUrl ? window.applicationBaseUrl : "";
    const serviceHost = Configs.serviceHost;
    let fullUrl =
      params.url.indexOf("http") == 0 ? params.url : serviceHost + params.url;
    var a = {
      url: fullUrl,
      data: params.data,
      method: _method,
      headers: {
        ...params.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      dataType: params.noDataType ? false : "json",
      contentType: params.noContentType
        ? false
        : "application/json; charset=utf-8",
      processData: params.noProcessData ? false : true,
      beforeSend: function(xhr) {
        !params.unBlockUi && _self.blockUi();
      },
      success: (result, status, xhr) => {
        let xhrParse = JSON.parse(xhr.getResponseHeader("X-Responded-JSON"));
        if (xhrParse && xhrParse.status == 401) {
          if (typeof params.error === "function") {
            params.error(xhr, status, "Unauthorized Access");
          }
        }
        if (result.isSuccess === true) {
          typeof params.success === "function" &&
            params.success(result, status, xhr);
        } else if (result.isSuccess === false) {
          typeof params.unsuccess === "function" &&
            params.unsuccess(result, status, xhr);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        typeof params.error === "function" &&
          params.error(jqXHR, textStatus, errorThrown);
      },
      complete: () => {
        !params.unBlockUi && _self.unBlockUi();
      },
    };
    $.ajax(a);
  };

  JSONStringify(obj) {
    return JSON.stringify(obj);
  }

  ajaxPost(options) {
    if (!options.noDataType) options.data = this.JSONStringify(options.data);
    this._sendAjax("POST", options);
  }

  ajaxGet(options) {
    this._sendAjax("GET", options);
  }
}
export default BaseComponent;
