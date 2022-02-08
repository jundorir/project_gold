import React, { Fragment } from "react";
import css from "./index.module.less";
import { checkFloatNumber } from "@utils/common";
import BuyWindow from "@components/BuyWindow";
import { inject, observer } from "mobx-react";
import ImpowerWindow from "@components/ImpowerWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { useHistory } from "react-router-dom";

function Buy(props) {
  const { chain, server } = props;
  const history = useHistory();
  const {
    currentEpochId,
    currentSlotId,
    _Limit,
    _LeftLimit,
    USDTBalance,
    _EndTime,
    _max,
    _min,
    isBuy,
    // _BeenUse,
  } = chain;
  const [inputNum, setinputNum] = React.useState(0);
  // const [GOLD_APPROVE_AMOUNT, setGILDApprove] = React.useState(0);
  const [USDT_APPROVE_AMOUNT, setUSDTApprove] = React.useState(0);
  const [impowerDisplay, setImpowerDisplay] = React.useState("none");
  const [buyWindowDisplay, setBuyWindowDisplay] = React.useState("none");
  const intervalRef = React.useRef(null);
  //3秒刷新
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        chain.getData();
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
      history.push({ pathname: "/" });
    }
  }, [chain.address, chain.bindParnet]);
  const [date, setDate] = React.useState({
    hour: "00",
    minutes: "00",
    seconds: "00",
  });
  React.useEffect(() => {
    if (chain.address) {
      chain.getData();
      chain.getBalance();
      queryAllowanceAll();
    }
  }, [chain.address]);
  async function queryAllowanceAll() {
    // const GOLDAllowance = await chain.queryAllowanceAsync({
    //   type: "goldBee",
    //   symbol: "GOLDBEAN",
    // });
    const USDTAllowance = await chain.queryAllowanceAsync({
      type: "goldBee",
      symbol: "USDT",
    });
    // console.log("查看授权金额", USDTAllowance);
    // setGILDApprove(GOLDAllowance);
    setUSDTApprove(USDTAllowance);
  }
  function purchase() {
    queryAllowanceAll();
    if (
      // GOLD_APPROVE_AMOUNT - _BeenUse >= 0 &&
      USDT_APPROVE_AMOUNT - inputNum >=
      0
    ) {
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
  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    computeDate();
    intervalRef.current = setInterval(() => {
      computeDate();
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [_EndTime]);
  function computeDate() {
    const date = Date.now();
    const diffTime = new Date(_EndTime * 1000).getTime() - date;
    if (diffTime <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      setDate({ hour: "00", minutes: "00", seconds: "00" });
    } else if (diffTime > 0) {
      let hour = ~~(diffTime / 1000 / 60 / 60);
      let minutes = ~~((diffTime / 1000 / 60) % 60);
      let seconds = ~~((diffTime / 1000) % 60);

      setDate({
        hour: hour.toString().padStart(2, 0),
        minutes: minutes.toString().padStart(2, 0),
        seconds: seconds.toString().padStart(2, 0),
      });
    }
  }
  function getBiggest() {
    setinputNum(_max);
  }
  function getSmallest() {
    setinputNum(_min);
  }
  function callback() {
    setinputNum(0);
  }
  function renderWindow() {
    if (impowerDisplay === "unset") {
      return (
        <div>
          <ImpowerWindow
            closeInpowerWindow={closeInpowerWindow}
            // GOLDApprove={GOLD_APPROVE_AMOUNT - _BeenUse >= 0}
            USDTApprove={USDT_APPROVE_AMOUNT - inputNum >= 0}
            updateData={queryAllowanceAll}
          />
        </div>
      );
    }
    if (buyWindowDisplay === "unset") {
      return (
        <div>
          <BuyWindow
            closeBuyWindow={closeBuyWindow}
            pledgeNum={inputNum}
            data={{
              currentEpochId,
              currentSlotId: currentSlotId.toString().padStart(3, 0),
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
              第&nbsp;&nbsp;<span className={css.number}>{currentEpochId}</span>
              &nbsp;&nbsp;轮
            </div>
            <div className={css.right}>
              第&nbsp;&nbsp;
              <span className={css.number}>
                {currentSlotId.toString().padStart(3, 0)}
              </span>
              &nbsp;&nbsp;期
            </div>
          </div>
          {/* 预约中 */}
          <div className={css.outerCicle}>
            <div className={css.innerCicle}>
              <div className={css.order}>认购中</div>
              <div className={css.bottom}>
                <span className={css.number}>
                  {_Limit > 0
                    ? _LeftLimit - _min >= 0
                      ? interception(((_Limit - _LeftLimit) * 100) / _Limit, 2)
                      : interception(100, 2)
                    : interception(0, 2)}
                </span>
                %
              </div>
            </div>
          </div>
          {/* 购买倒计时 */}
          <div className={css.buyBox}>
            <div className={css.buyBoxTop}>
              <div className={css.title}>结束倒计时</div>
              <div className={css.time}>
                <span className={css.number}>{date.hour}</span>
                <span className={css.unit}>时</span>
                <span className={css.number}>{date.minutes}</span>
                <span className={css.unit}>分</span>
                <span className={css.number}>{date.seconds}</span>
                <span className={css.unit}>秒</span>
              </div>
            </div>
            <div className={css.buyBoxBottom}>
              <div className={css.inner}>
                <div className={css.current}>
                  <div className={css.left}>
                    <div className={css.currenttitle}>本期总量</div>
                    <div>
                      <span className={css.number}>{_Limit}</span>
                      <span className={css.unit}>USDT</span>
                    </div>
                  </div>
                  <div className={css.right}>
                    <div className={css.currenttitle}>剩余</div>
                    <div>
                      <span className={css.number}>{_LeftLimit-_min>=0?_LeftLimit:0}</span>
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
                          if (number - _max > 0) {
                            number = _max;
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
                      <span className={css.leftNumber}>{USDTBalance} </span>
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
                    if (inputNum <= 0 || inputNum - _min < 0) {
                      Toast.show({
                        icon: "fail",
                        content: `认购金额低于最小认购金额${_min}`,
                        duration: 1000,
                      });
                    } else if (inputNum - _max > 0) {
                      Toast.show({
                        icon: "fail",
                        content: `认购金额高于最大认购金额${_max}`,
                        duration: 1000,
                      });
                    } else if (
                      inputNum > 0 &&
                      inputNum - _min >= 0 &&
                      inputNum - _max <= 0 &&
                      inputNum - USDTBalance <= 0 &&
                      inputNum - _LeftLimit <= 0 &&
                      !isBuy &&
                      new Date(_EndTime * 1000).getTime() - Date.now() > 0
                    ) {
                      purchase();
                    } else if (inputNum - USDTBalance > 0) {
                      Toast.show({
                        icon: "fail",
                        content: `可用余额不足`,
                        duration: 1000,
                      });
                    } else if (inputNum - _LeftLimit > 0) {
                      Toast.show({
                        icon: "fail",
                        content: `剩余可认购资产不足`,
                        duration: 1000,
                      });
                    } else if (isBuy) {
                      Toast.show({
                        icon: "fail",
                        content: `您已经认购过当前期了`,
                        duration: 1000,
                      });
                    } else if (
                      new Date(_EndTime * 1000).getTime() - Date.now() <=
                      0
                    ) {
                      Toast.show({
                        icon: "fail",
                        content: `认购时间已结束`,
                        duration: 1000,
                      });
                    }
                  }}
                >
                  立即认购
                </div>
                <div className={css.info}>
                  {/* 说明：参与本次认购需要消耗{parseInt(_BeenUse)}个金豆 */}
                  说明：单笔订单金额{_min}到{_max}
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

export default inject("chain", "server")(observer(Buy));
