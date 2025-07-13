import React from "react";
import classNames from "classnames/bind";
import styles from "./EditProduct.module.scss";
import Create from "../../../components/Create";
import { useParams } from "react-router-dom";

const cx = classNames.bind(styles);

const EditProduct = () => {
  const { id } = useParams();
  return (
    <div className={cx("Create")}>
      <Create title="Chỉnh sửa sản phẩm" productId={id} />
    </div>
  );
};

export default EditProduct;
