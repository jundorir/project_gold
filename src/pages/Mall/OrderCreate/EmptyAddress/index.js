import React from "react";
import css from "./index.module.less";
import { RightOutline } from "antd-mobile-icons";

function EmptyAddress(props) {
  return (
    <div
      className={css.empty}
      onClick={() => {
        props.onClick();
      }}
    >
      <div className={css.left}>
        <div className={css.icon}></div>
        <div className={css.box}>
          <div className={css.top}>暂无地址</div>
          <div className={css.bottom}>前往添加收货地址</div>
        </div>
      </div>
      <div className={css.right}>
        <RightOutline className={css.arrow} />
      </div>
    </div>
  );
}

export default EmptyAddress;
