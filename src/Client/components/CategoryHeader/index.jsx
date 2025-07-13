import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CategoryHeader.module.scss";
import PropTypes from "prop-types";
import { getCategorys } from "../../../services/category.service";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

CategoryHeader.propTypes = {
  props: PropTypes.string,
};

function CategoryHeader({ props }) {
  const [listChildCategorys, setListChildCategorys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const response = await getCategorys();
        if (response) {
          // Lọc danh mục cha (các danh mục có parent_id === props)
          const filteredCategories = response.filter(
            (category) => category.parent_id === props
          );

          // Lấy danh sách danh mục con tương ứng với từng danh mục cha
          const childCategories = filteredCategories.map((parent) => ({
            parent_id: parent._id,
            title: parent.title, // Lưu title của danh mục cha
            slug: parent.slug,
            children: response.filter(
              (category) => category.parent_id === parent._id
            ),
          }));

          setListChildCategorys(childCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorys();
  }, [props]);

  const handleListProduct = (slug, title) => {
    navigate(`/products/${slug}`, { state: { title } });
    window.scrollTo({ top: 0, behavior: "smooth" });
    // console.log(slug, title);
  };

  return (
    <div className={cx("category")}>
      <div className={cx("info")}>
        {listChildCategorys.map((categoryGroup) => (
          <div key={categoryGroup.parent_id} className={cx("list-category")}>
            <div
              className={cx("title-category")}
              onClick={() =>
                handleListProduct(categoryGroup.slug, categoryGroup.title)
              }
            >
              {categoryGroup.title}
            </div>
            <ul className={cx("category-chil")}>
              {categoryGroup.children.map((child) => (
                <li
                  key={child._id}
                  onClick={() => handleListProduct(child.slug, child.title)}
                >
                  {child.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryHeader;
