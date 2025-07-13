import React from "react";
import classNames from "classnames/bind";
import styles from "./CreateProduct.module.scss";
import Create from "../../../components/Create";

const cx = classNames.bind(styles);

const CreateProduct = () => {
  return (
    <div className={cx("ceate")}>
      <Create title="Sản phẩm mới" />
    </div>
  );
};

export default CreateProduct;
