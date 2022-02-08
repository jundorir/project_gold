import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function SubscribeWindow(props) {
  const { chain, data,  } = props;
  const {currentEpochId, currentSlotId} = props.data
  const { toSubscribe } = chain;
  const closeWindow = React.useCallback(() => {
    props.closeBuyWindow();
  }, [props]);
  async function toBuy() {
    try {
      const result = await toSubscribe(
        currentEpochId,
        currentSlotId,
        props.pledgeNum
      );
      if (result) {
        Toast.show({ icon: "success", content: "购买成功", duration: 700 });
        closeWindow();
        chain.requestChainData();
        props.callback();
      }
    } catch (error) {
      Toast.show({ icon: "fail", content: "购买失败", duration: 700 });
    }
  }
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
          <div className={css.describeBottpm}>请确认您的预购信息</div>
        </div>
        <div className={css.bottom}>
          <div className={css.line}>
            <div className={css.left}>期数</div>
            <div className={css.right}>
              第 {data.currentEpochId} 轮 {data.currentSlotId} 期
            </div>
          </div>
          <div className={css.divider}></div>
          <div className={css.line}>
            <div className={css.left}>认购金额</div>
            <div className={css.right}>
              {props.pledgeNum}
              <span className={css.unit}>USDT</span>
            </div>
          </div>
          <div className={css.divider}></div>
          <div className={css.button} onClick={toBuy}>
            确定
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain")(observer(SubscribeWindow));
