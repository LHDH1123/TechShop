import React from "react";
import classNames from "classnames/bind";
import styles from "./Error404.module.scss";

const cx = classNames.bind(styles);

const Error404 = () => {
  return (
    <div className={cx("error")}>
      <div className={cx("state")}>404</div>
      <div className={cx("title")}>Không tìm thấy trang bạn đang tìm kiếm</div>
      <a href="/">Về trang chủ</a>
    </div>
  );
};

export default Error404;
