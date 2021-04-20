
const storage = window.sessionStorage

/**
 * SensitiveStorage class
 *
 * @description
 */
class SensitiveStorage {
  //User id
  setUserId(id) {
    storage.setItem("user_id", `${id}`);
  }

  getUserId() {
    return parseInt(storage.getItem("user_id"));
  }  

  removeUserId() {
    storage.removeItem("user_id");
  }
  //User role
  setUserRole(role) {
    storage.setItem("USER_ROLE", `${role}`);
  }

  getUserRole() {
    return parseInt(storage.getItem("USER_ROLE"));
  }

  removeUserRole() {
    storage.removeItem("USER_ROLE");
  }
  //Student id
  setStudentId(id) {
    storage.setItem("student_id", `${id}`);
  }

  getStudentId() {
    return parseInt(storage.getItem("student_id"));
  }
  removeStudentId() {
    storage.removeItem("student_id");
  }
  //Teacher Id
  setTeacherId(id) {
    storage.setItem("teacher_id", `${id}`);
  }

  getTeacherId() {
    return parseInt(storage.getItem("teacher_id"));
  }

  removeTeacherId() {
    storage.removeItem("teacher_id");
  }
}
export const sensitiveStorage = new SensitiveStorage();

export default SensitiveStorage;
