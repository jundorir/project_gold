import React, { useEffect } from "react";
import css from "./index.module.less";
// import { checkFloatNumber } from "@utils/common";
// import BuyWindow from "@components/BuyWindow";
import { inject, observer } from "mobx-react";
// import ImpowerWindow from "@components/ImpowerWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { useHistory } from "react-router-dom";

function Subscribe(props) {
  const history = useHistory();
  const { chain, view } = props;
  const { subscribeList } = chain;
  // console.log("subscribeList------->", subscribeList);
  //进入页面初始化
  useEffect(() => {
    chain.initialize();
  }, []);
  useEffect(() => {
    if (chain.address) {
      chain.getData();
      chain.getSubscribeData();
      // if (chain.currentEpochId && chain.currentSlotId) {
      //   const [epochid, slotid] = [
      //     chain.currentEpochId,
      //     chain.currentSlotId - 0 + 1,
      //   ];
      //   for (let i = slotid; i < slotid + 10; i++) {
      //     chain.getSubscribeList(epochid, i);
      //   }
      // }
    }
  }, [chain.address]);
  //3秒刷新
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        chain.getData();
        chain.getSubscribeData();
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  function renderList() {
    // const sortList = chain.subscribeList
    //   .slice()
    //   .sort((a, b) => a.slotid - b.slotid);
    return subscribeList.map((item, index) => {
      return (
        <div className={css.box} key={index}>
          <div className={css.boxInner}>
            <div className={css.title}>
              <div className={css.left}>
                <span className={css.wordLeft}>预约期数：</span>
                <span className={css.word}>第</span>
                <span className={css.number}>
                  &nbsp;{chain.currentEpochId}&nbsp;
                </span>
                <span className={css.word}>轮</span>
                <span className={css.number}>
                  &nbsp;{(item.slotid + "").padStart(3, 0)}&nbsp;
                </span>
                <span className={css.word}>期</span>
              </div>
              <div className={css.right}>预约中</div>
            </div>
            <div className={css.figure}>
              <div
                className={css.rate}
                style={{
                  width:
                    (item.subScribeAmount -
                      item.hasSubScribedAmount -
                      item.LowLimit >=
                    0
                      ? item.hasSubScribedAmount / item.subScribeAmount
                      : 1) *
                      100 +
                    "%",
                }}
              ></div>
            </div>
            <div className={css.limit}>
              <div className={css.lfet}>
                <span className={css.lfetNum}>{item.hasSubScribedAmount}</span>
                &nbsp;USDT
              </div>
              <div className={css.right}>
                <span className={css.rightNum}>{item.subScribeAmount}</span>
                &nbsp;USDT
              </div>
            </div>
            <div
              className={css.button}
              onClick={() => {
                if (
                  chain.address &&
                  chain.bindParnet !==
                    "0x0000000000000000000000000000000000000000" &&
                  item.subScribeAmount -
                    item.hasSubScribedAmount -
                    item.LowLimit >=
                    0
                ) {
                  toSubscribeBuy(item);
                } else if (!chain.address) {
                  Toast.show({
                    icon: "fail",
                    content: "钱包未连接",
                    duration: 700,
                  });
                } else if (
                  chain.bindParnet ===
                  "0x0000000000000000000000000000000000000000"
                ) {
                  Toast.show({
                    icon: "fail",
                    content: "请先激活账户",
                    duration: 700,
                  });
                } else if (
                  item.subScribeAmount -
                    item.hasSubScribedAmount -
                    item.LowLimit <
                  0
                ) {
                  Toast.show({
                    icon: "fail",
                    content: "当前期已预约满",
                    duration: 700,
                  });
                }
              }}
            >
              预约
            </div>
          </div>
        </div>
      );
    });
  }
  function toSubscribeBuy(item) {
    history.push({
      pathname: `/subscribe/buy/${chain.currentEpochId}&${item.slotid}`,
    });
  }
  return (
    <div className={css.contain}>
      <div className={css.inner}>{renderList()}</div>
    </div>
  );
}

export default inject("chain", "view")(observer(Subscribe));
