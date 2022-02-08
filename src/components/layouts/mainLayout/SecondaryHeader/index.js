import React from "react";
import css from "./index.module.less";
import { useHistory } from "react-router-dom";
import Goback from "@assets/images/icon/goback.png";

function Header(props) {
  const history = useHistory();
  const { title } = props;
  return (
    <div className={css.header}>
      <div
        className={css.left}
        onClick={() => {
          history.goBack();
        }}
      >
        <img className={css.goback} src={Goback} alt="⬅" />
      </div>
      <div className={css.right}>
        <div className={css.title}>{title["SimplifiedChinese"]}</div>
      </div>
    </div>
  );
}

export default Header;
