import { Route, Routes } from "react-router-dom";

import Home from "../Client/pages/Home";
import LayoutDefault from "../Client/Layouts/LayoutDefault";
// import LayoutDefaultAdmin from "../Admin/layouts/LayoutDefault";
import Product from "../Client/pages/Product";
import Error404 from "../Client/pages/Error404";
// import ProductAdmin from "../Admin/pages/Product";
// import BrandAdmin from "../Admin/pages/Brand";
// import CategoryAdmin from "../Admin/pages/Category";
// import AccountAdmin from "../Admin/pages/Account";
import LoginAdmin from "../Admin/pages/Login";
// import RoleAdmin from "../Admin/pages/Role";
// import CreateProduct from "../Admin/pages/Product/CreateProduct";
// import DetailProduct from "../Admin/pages/DetailProduct";
// import EditProduct from "../Admin/pages/Product/EditProduct";
// import PermissionRole from "../Admin/pages/Role/Permissions";

export default function Router() {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={<LayoutDefault />}>
        <Route index element={<Home />} />
        <Route path="products/:slug" element={<Product />} />
        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Admin Login */}
      <Route path="/adminbb/login" element={<LoginAdmin />} />

      {/* Admin Protected Routes */}
      {/* <Route
        path="/adminbb"
        element={
          <PrivateRoute>
            <LayoutDefaultAdmin />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="product-list" element={<ProductAdmin />} />
        <Route path="brand-list" element={<BrandAdmin />} />
        <Route path="category" element={<CategoryAdmin />} />
        <Route path="user" element={<AccountAdmin />} />
        <Route path="role" element={<RoleAdmin />} />
        <Route path="flashsale" element={<Voucher />} />
        <Route path="order" element={<OrderAdmin />} />
        <Route path="review" element={<ReviewAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="detail-product/:id" element={<DetailProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="role/permissions/:id" element={<PermissionRole />} />
        <Route path="*" element={<Error404 />} />
      </Route> */}
    </Routes>
  );
}
