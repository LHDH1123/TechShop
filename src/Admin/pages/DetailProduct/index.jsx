import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./DetailProduct.module.scss";
import Header from "../../../Admin/components/Header";
import { useParams } from "react-router-dom";
import { getDetailProduct } from "../../../services/product.service";
import { getNameBrand } from "../../../services/brand.service";
import { getNameCategory } from "../../../services/category.service";

const cx = classNames.bind(styles);

const DetailProduct = () => {
  const { id } = useParams();
  const [getProduct, setGetProducts] = useState([]);

  const fetchDetailProduct = async (id) => {
    try {
      const response = await getDetailProduct(id);
      if (response?.length > 0) {
        const [product] = response;
        const [nameBrand, nameCategory] = await Promise.all([
          getNameBrand(product.brand_id),
          getNameCategory(product.category_id),
        ]);
        product.nameBrand = nameBrand;
        product.nameCategory = nameCategory;
        setGetProducts(product);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailProduct(id);
    }
  }, [id]);

  console.log(getProduct);

  return (
    <div className={cx("detailProduct")}>
      <Header title="Chi tiết sản phẩm" />

      <div className={cx("productDetailContainer")}>
        <div className={cx("leftSection")}>
          {/* Bảng thông tin sản phẩm */}
          <table className={cx("productTable")}>
            <tbody>
              <tr>
                <td className={cx("label")}>Sản phẩm</td>
                <td>{getProduct.title}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Danh mục</td>
                <td>{getProduct.nameCategory}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Thương hiệu</td>
                <td>{getProduct.nameBrand}</td>
              </tr>
              <tr>
                <td className={cx("label")}>SKU</td>
                <td>{getProduct.SKU}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Số lượng</td>
                <td>{getProduct.stock}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Giảm giá</td>
                <td>{getProduct.discountPercentage}%</td>
              </tr>
              <tr>
                <td className={cx("label")}>Giá</td>
                <td>{getProduct.price}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Vị trí</td>
                <td>{getProduct.position}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Trạng thái</td>
                <td>{getProduct.status ? "Hoạt động" : "Không hoạt động"}</td>
              </tr>
              <tr>
                <td className={cx("label")}>Mô tả</td>
                <td>{getProduct.description}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className={cx("rightSection")}>
          <div className={cx("productImageSection")}>
            {getProduct?.thumbnail?.length > 0 && (
              <img
                src={getProduct.thumbnail[0]}
                alt={getProduct.title || "Product Image"}
                className={cx("productImage")}
              />
            )}

            <p className={cx("imageInfo")}>{getProduct.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
