import React from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./MainContent.module.scss";

const cx = classNames.bind(styles);

const MainContent = () => {
  return (
    <div className={cx("main_content")}>
      <Outlet />
    </div>
  );
};

export default MainContent;
