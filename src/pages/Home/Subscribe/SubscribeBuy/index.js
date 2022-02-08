import React, { Fragment, useEffect, useState } from "react";
import css from "./index.module.less";
import { checkFloatNumber } from "@utils/common";
import SubscribeWindow from "@components/SubscribeWindow";
import { inject, observer } from "mobx-react";
import ImpowerWindow from "@components/ImpowerWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { useParams, useHistory } from "react-router-dom";

function SubscribeBuy(props) {
  const params = useParams();
  const { chain } = props;
  const history = useHistory();
  const { USDTBalance } = chain;
  const [inputNum, setinputNum] = React.useState(0);
  const [USDT_APPROVE_AMOUNT, setUSDTApprove] = React.useState(0);
  const [impowerDisplay, setImpowerDisplay] = React.useState("none");
  const [buyWindowDisplay, setBuyWindowDisplay] = React.useState("none");
  const [data, setData] = React.useState({
    LowLimit: 0,
    hasSubScribedAmount: 0,
    isSubscribe: false,
    slotid: "",
    subScribeAmount: 0,
    topLimit: 0,
  });

  //3秒刷新
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        // chain.getCurrentSubscribe(params.epochid, params.slotid);
        chain.getSubscribeData();
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  React.useEffect(() => {
    if (
      !chain.address ||
      chain.bindParnet === "0x0000000000000000000000000000000000000000"
    ) {
      history.push({ pathname: "/subscribe" });
    }
  }, [chain.address, chain.bindParnet]);
  React.useEffect(() => {
    if (chain.address) {
      queryAllowanceAll();
      chain.getBalance();
      // chain.getCurrentSubscribe(params.epochid, params.slotid);
      chain.getSubscribeData();
    }
  }, [chain.address]);
  React.useEffect(() => {
    if (chain.subscribeList.length > 0) {
      const result = chain.subscribeList.filter((item) => {
        return item.slotid === params.slotid;
      });
      console.log("result===========>", result);
      if (result.length > 0) {
        setData(result[0]);
      } else {
        history.push({ pathname: "/" });
      }
    }
  }, [chain.subscribeList]);
  async function queryAllowanceAll() {
    const USDTAllowance = await chain.queryAllowanceAsync({
      type: "goldBee",
      symbol: "USDT",
    });
    // console.log("查看授权金额", USDTAllowance);
    setUSDTApprove(USDTAllowance);
  }
  function purchase() {
    queryAllowanceAll();
    if (USDT_APPROVE_AMOUNT - inputNum >= 0) {
      setBuyWindowDisplay("unset");
    } else {
      setImpowerDisplay("unset");
    }
  }
  const closeBuyWindow = React.useCallback(() => {
    setBuyWindowDisplay("none");
  }, []);
  const closeInpowerWindow = React.useCallback(() => {
    setImpowerDisplay("none");
  }, []);

  function getBiggest() {
    setinputNum(data.topLimit);
  }
  function getSmallest() {
    setinputNum(data.LowLimit);
  }
  function callback() {
    setinputNum(0);
    // chain.getCurrentSubscribe(params.epochid, params.slotid);
    chain.getSubscribeData();
  }
  //渲染弹窗
  function renderWindow() {
    if (impowerDisplay === "unset") {
      return (
        <div>
          <ImpowerWindow
            closeInpowerWindow={closeInpowerWindow}
            USDTApprove={USDT_APPROVE_AMOUNT - inputNum >= 0}
            updateData={queryAllowanceAll}
          />
        </div>
      );
    }
    if (buyWindowDisplay === "unset") {
      return (
        <div>
          <SubscribeWindow
            closeBuyWindow={closeBuyWindow}
            pledgeNum={inputNum}
            data={{
              currentEpochId: params.epochid,
              currentSlotId: (params.slotid + "").padStart(3, 0),
            }}
            callback={callback}
          />
        </div>
      );
    }
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.title}>
            <div className={css.left}>
              第&nbsp;&nbsp;
              <span className={css.number}>{params.epochid}</span>
              &nbsp;&nbsp;轮
            </div>
            <div className={css.right}>
              第&nbsp;&nbsp;
              <span className={css.number}>
                {(params.slotid + "").padStart(3, 0)}
              </span>
              &nbsp;&nbsp;期
            </div>
          </div>
          {/* 预约中 */}
          <div className={css.outerCicle}>
            <div className={css.innerCicle}>
              <div className={css.order}>预约中</div>
              <div className={css.bottom}>
                <span className={css.number}>
                  {data.subScribeAmount > 0
                    ? data.subScribeAmount -
                        data.hasSubScribedAmount -
                        data.LowLimit >=
                      0
                      ? interception(
                          (data.hasSubScribedAmount * 100) /
                            data.subScribeAmount,
                          2
                        )
                      : interception(100, 2)
                    : interception(0, 2)}
                </span>
                %
              </div>
            </div>
          </div>
          <div className={css.buyBox}>
            <div className={css.buyBoxBottom}>
              <div className={css.inner}>
                <div className={css.current}>
                  <div className={css.left}>
                    <div className={css.currenttitle}>本期总量</div>
                    <div>
                      <span className={css.number}>{data.subScribeAmount}</span>
                      <span className={css.unit}>USDT</span>
                    </div>
                  </div>
                  <div className={css.right}>
                    <div className={css.currenttitle}>剩余</div>
                    <div>
                      <span className={css.number}>
                        {data.subScribeAmount -
                          data.hasSubScribedAmount -
                          data.LowLimit >=
                        0
                          ? data.subScribeAmount - data.hasSubScribedAmount
                          : 0}
                      </span>
                      <span className={css.unit}>USDT</span>
                    </div>
                  </div>
                </div>
                <div className={css.inputNum}>
                  <input
                    value={inputNum}
                    type="number"
                    className={css.input}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setinputNum("");
                      } else {
                        if (checkFloatNumber(e.target.value)) {
                          let number = e.target.value;
                          if (number - USDTBalance > 0) {
                            number = USDTBalance;
                          }
                          if (number - data.topLimit > 0) {
                            number = data.topLimit;
                          }
                          if (number.length > 1 && number.startsWith("0")) {
                            number = number.replace(/^[0]+/, "");
                            if (number === "") number = "0";
                            if (number.startsWith(".")) number = "0" + number;
                          }
                          setinputNum(parseInt(number));
                        }
                      }
                    }}
                  />
                </div>
                <div className={css.balance}>
                  <div className={css.left}>
                    <div className={css.leftWord}>可用余额</div>
                    <div>
                      <span className={css.leftNumber}>
                        {interception(USDTBalance)}{" "}
                      </span>
                      USDT
                    </div>
                  </div>
                  <div className={css.right}>
                    <div className={css.biggest} onClick={getBiggest}>
                      最大
                    </div>
                    <div className={css.smallest} onClick={getSmallest}>
                      最小
                    </div>
                  </div>
                </div>
                <div
                  className={css.button}
                  onClick={() => {
                    if (inputNum <= 0 || inputNum - data.LowLimit < 0) {
                      Toast.show({
                        icon: "fail",
                        content: `认购金额低于最小认购金额${data.LowLimit}`,
                        duration: 1000,
                      });
                    } else if (inputNum - data.topLimit > 0) {
                      Toast.show({
                        icon: "fail",
                        content: `认购金额高于最大认购金额${data.topLimit}`,
                        duration: 1000,
                      });
                    } else if (
                      inputNum > 0 &&
                      inputNum - data.LowLimit >= 0 &&
                      inputNum - data.topLimit <= 0 &&
                      inputNum - USDTBalance <= 0 &&
                      inputNum -
                        (data.subScribeAmount - data.hasSubScribedAmount) <=
                        0 &&
                      !data.isSubscribe
                    ) {
                      purchase();
                    } else if (inputNum - USDTBalance > 0) {
                      Toast.show({
                        icon: "fail",
                        content: `可用余额不足`,
                        duration: 1000,
                      });
                    } else if (
                      inputNum -
                        (data.subScribeAmount - data.hasSubScribedAmount) >
                      0
                    ) {
                      Toast.show({
                        icon: "fail",
                        content: `剩余可认购资产不足`,
                        duration: 1000,
                      });
                    } else if (data.isSubscribe) {
                      Toast.show({
                        icon: "fail",
                        content: `每期仅能预约一次`,
                        duration: 1000,
                      });
                    }
                  }}
                >
                  立即预约
                </div>
                <div className={css.info}>
                  说明：单笔订单金额{data.LowLimit}到{data.topLimit}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderWindow()}
    </Fragment>
  );
}

export default inject("chain", "server")(observer(SubscribeBuy));
