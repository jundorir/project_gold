import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function ImpowerWindow(props) {
  const { chain, GOLDApprove, USDTApprove, updateData } = props;
  const closeWindow = React.useCallback(() => {
    props.closeInpowerWindow();
  }, [props]);
  // 授权GOLD
  // const toApproveGOLD = React.useCallback(async () => {
  //   let symbol = "GOLDBEAN";
  //   let { status, approveAmount } = await chain.toApprove({
  //     type: "goldBee",
  //     symbol,
  //   });
  //   if (status) {
  //     updateData();
  //     Toast.show({ icon: "success", content: "授权成功", duration: 700 });
  //     if (USDTApprove) {
  //       closeWindow();
  //     }
  //   }
  // }, [chain, closeWindow]);
  // 授权USDT
  const toApproveUSDT = React.useCallback(async () => {
    let symbol = "USDT";
    let { status } = await chain.toApprove({
      type: "goldBee",
      symbol,
    });
    if (status) {
      updateData();
      Toast.show({ icon: "success", content: "授权成功", duration: 700 });
      // console.log(GOLDApprove, USDTApprove)
      closeWindow();
      // if (GOLDApprove) {
      //   closeWindow();
      // }
    }
  }, [chain, closeWindow]);
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
          <div className={css.title}>USDT资产</div>
          <div
            className={classNames(
              css.authorizationBTN,
              USDTApprove && css.disabled
            )}
            onClick={() => {
              if (!USDTApprove) {
                toApproveUSDT();
              }
            }}
          >
            {USDTApprove ? "已授权" : "授权"}
          </div>
        </div>
        {/* <div className={css.bottomButton}>
          <div className={css.title}>GOLD资产</div>
          <div
            className={classNames(css.pledgeBTN, GOLDApprove && css.disabled)}
            onClick={() => {
              if (!GOLDApprove) {
                toApproveGOLD();
              }
            }}
          >
            {GOLDApprove ? "已授权" : "授权"}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default inject("chain")(observer(ImpowerWindow));
