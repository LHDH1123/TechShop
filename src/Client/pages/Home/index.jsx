import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import ListProduct from "../../components/ListProduct";
import ButtonAll from "../../components/ButtonAll";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div className={cx("Home")}>
      {/* Banner Section */}

      {/* Content Section */}
      <div className={cx("home_content")}>
        <ListProduct title="Razer" />
        <ButtonAll title="razer" />
      </div>

      <div className={cx("home_content")}>
        <ListProduct title="Logitech G" />
        <ButtonAll title="logitech-g" />
      </div>

      <div className={cx("home_content")}>
        <ListProduct title="SteelSeries" />
        <ButtonAll title="steelseries" />
      </div>
    </div>
  );
};

export default Home;
