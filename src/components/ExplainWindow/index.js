import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function GainWindow(props) {
  const closeWindow = React.useCallback(() => {
    props.closeExplainWindow();
  }, [props]);
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.gainBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css.clear}></div>
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div className={css.describe}>
          <div className={css.describeTop}>提示</div>
          <div className={css.describeBottpm}>请确认您的收获信息</div>
        </div>
        <div className={css.bottom}>
          <div className={css.line}>
            <div className={css.left}>静态收益</div>
            <div className={css.right}>
              {props.home_usdt_static}
              <span className={css.unit}>USDT</span>
            </div>
          </div>
          <div className={css.divider}></div>
          <div className={css.line}>
            <div className={css.left}>动态收益</div>
            <div className={css.right}>
              {props.home_usdt_dynamic}
              <span className={css.unit}>USDT</span>
            </div>
          </div>
          <div className={css.button} onClick={closeWindow}>
            确定
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain")(observer(GainWindow));
