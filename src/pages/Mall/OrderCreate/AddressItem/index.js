import React from "react";
import classNames from "classnames";
import css from "./index.module.less";
import { RightOutline } from "antd-mobile-icons";

function AddressItem(props) {
  const {
    type, // choose
    name = "张小二",
    mobile = "138***5678",
    lable = "默认",
    isDefault = "0",
    address = "重庆市渝北区龙山街道xx小区xx栋xx楼 xxx号",
    area,
    isSelected = true,
  } = props;

  const tag = isDefault === "1" ? "默认" : lable;
  function renderRight() {
    if (type === "show") {
      return (
        <div className={css.right}>
          <RightOutline className={css.arrow} />
        </div>
      );
    }

    return (
      <div className={classNames(css.right, css.circularBorder)}>
        <div
          className={classNames(css.circular, isSelected && css.selected)}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={css.item}
      onClick={() => {
        props.onClick();
      }}
    >
      <div className={css.left}>
        <div className={css.top}>
          <div className={css.name}>{name}</div>
          <div className={css.tel}>{mobile}</div>
          <div
            className={classNames(css.tag, isDefault === "1" && css.default)}
          >
            {tag}
          </div>
        </div>
        <div className={css.bottom}>{area}{address}</div>
      </div>
      {renderRight()}
    </div>
  );
}

export default AddressItem;
