
// @material-ui/icons
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Face as FaceIcon,
  Class as ClassIcon,
  LibraryBooks as LibraryBooksIcon
} from "@material-ui/icons";
import ScheduleTeachPage from "views/teacher/pages/ScheduleTeachPage";
import ClassManagement from "views/teacher/pages/ClassManagement";
import TeacherInfoPage from "views/teacher/pages/TeacherInfoPage";
import StudentInfoPage from "views/student/pages/StudentInfoPage";
import SubjectPage from "views/student/pages/SubjectPage";
import TrainFacePage from "views/student/pages/TrainFacePage";

const teacherRoutes = [
  {
    path: "/teaching-schedule",
    name: "Lịch giảng dạy",
    icon: DashboardIcon,
    component: ScheduleTeachPage,
    layout: "/teacher"
  },
  {
    path: "/classes",
    name: "Quản lí lớp",
    icon: ClassIcon,
    component: ClassManagement,
    layout: "/teacher"
  },
  {
    path: "/info",
    name: "Thông tin cá nhân",
    icon: PersonIcon,
    component: TeacherInfoPage,
    layout: "/teacher"
  },
];
const studentRoutes = [
  {
    path: "/subject",
    name: "Môn học",
    icon: LibraryBooksIcon,
    component: SubjectPage,
    layout: "/student"
  },
  {
    path: "/train-face",
    name: "Train face",
    icon: FaceIcon,
    component: TrainFacePage,
    layout: "/student"
  },
  {
    path: "/info",
    name: "Thông tin cá nhân",
    icon: PersonIcon,
    component: StudentInfoPage,
    layout: "/student"
  },
];
export { teacherRoutes, studentRoutes };
