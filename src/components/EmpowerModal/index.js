import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import classNames from "classnames";
import { inject, observer } from "mobx-react";

function EmpowerWindow(props) {
  const { isGOLDApprove, toApprove, GOLD } = props;
  const closeWindow = React.useCallback(() => {
    props.closeModal();
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
        {/* 关闭按钮 */}
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
          <div className={css.describeBottpm}>
            您需要授权合约访问您的以下地址
          </div>
        </div>

        <div className={css.bottomButton}>
          <div className={css.title}>GOLD资产</div>
          <div
            className={classNames(css.pledgeBTN, isGOLDApprove && css.disabled)}
            onClick={() => {
              if (!isGOLDApprove) {
                toApprove(GOLD);
              }
            }}
          >
            {isGOLDApprove ? "已授权" : "授权"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain")(observer(EmpowerWindow));
