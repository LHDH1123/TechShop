import { createContext, useContext, useEffect, useState } from "react";
import { AxiosInstance } from "../../configs/axios";
import {  getNameBrand } from "../../services/brand.service";
import { getCategorys } from "../../services/category.service";
import { getAllProducts } from "../../services/product.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [brands, setBrands] = useState(null);
  const [address, setAddress] = useState(null);
  const [listChildCategorys, setListChildCategorys] = useState([]);
  const [props, setProps] = useState(null);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [brandshaveProduct, setBrandsHaveProduct] = useState(null);

  const [updateUser, setUpdateUser] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const [nameUser, setNameUser] = useState("");

  const fetchBrandsHaveProduct = async () => {
    try {
      const products = await getAllProducts(); // Lấy tất cả sản phẩm
      const uniqueBrandIds = [...new Set(products.map((p) => p.brand_id))]; // Lọc ra danh sách brand_id duy nhất

      // Gọi API song song cho tất cả brand_id
      const brandsData = await Promise.all(
        uniqueBrandIds.map(async (id) => {
          const name = await getNameBrand(id);
          return { id, name };
        })
      );

      // Lọc các brand có sản phẩm
      const brandsWithProducts = brandsData.filter((brand) =>
        products.some((product) => product.brand_id === brand.id)
      );

      setBrandsHaveProduct(brandsWithProducts);
    } catch (error) {
      console.error("❌ Lỗi khi tải các thương hiệu có sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchBrandsHaveProduct();
  }, []);

  // const fetchBrands = async () => {
  //   try {
  //     const response = await getBrands();
  //     if (response) {
  //       setBrands(response);
  //     }
  //   } catch (error) {
  //     console.error("❌ Lỗi khi tải giỏ thích:", error);
  //   }
  // };

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

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        setUpdateUser,
        nameUser,
        setNameUser,
        brands,
        setBrands,
        address,
        setAddress,
        props,
        setProps,
        listChildCategorys,
        setListChildCategorys,
        isModalLogin,
        setIsModalLogin,
        brandshaveProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
