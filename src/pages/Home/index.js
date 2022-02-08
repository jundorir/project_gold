import React, { Fragment, useCallback } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import HomeGainWindow from "@components/HomeGainWindow";
import ExplainWindow from "@components/ExplainWindow";
import NoticeWindow from "@components/NoticeWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { getReward } from "@utils/web3utils_future";
import { useHistory } from "react-router-dom";
import loading from "@utils/loading";
import { fetchGain } from "@common/api";
import { getQueryString } from "@utils/common";
import Activate from "@components/RegisterWindow";

function Home(props) {
  const history = useHistory();
  const { chain, server } = props;
  const { currentEpochId, currentSlotId, _Limit, _LeftLimit, _EndTime, _min } =
    chain;
  const {
    home_usdt,
    home_usdt_static,
    home_usdt_dynamic,
    home_beans,
    home_beans_already,
    home_principal,
  } = server;
  const [gainDisplay, setGainDisplay] = React.useState("none");
  const [explainDisplay, setExplainDisplay] = React.useState("none");
  const [noticeDisplay, setNoticeDisplay] = React.useState("none");
  const [display, setDisplay] = React.useState("none");
  const intervalRef = React.useRef(null);
  const [date, setDate] = React.useState({
    hour: "00",
    minutes: "00",
    seconds: "00",
  });
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
        hour: hour.toString(),
        minutes: minutes.toString().padStart(2, 0),
        seconds: seconds.toString().padStart(2, 0),
      });
    }
  }
  //3秒刷新
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        chain.getData();
        server.homepageData(chain.address);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  //领取收益
  const handleGain = React.useCallback(async () => {
    if (chain.address) {
      try {
        loading.show();
        const data = await fetchGain(chain.address);
        loading.hidden();
        // console.log("首页领取返回的data--->", data);
        if (data) {
          const { usdtHex, beansHex, idx, sign, userAddress } = data;
          try {
            const data = await getReward({
              amount: usdtHex,
              beeAmount: beansHex,
              id: idx,
              timstamp: sign,
              userAddress,
            });
            if (data) {
              Toast.show({
                icon: "success",
                content: "领取成功",
                duration: 700,
              });
              server.homepageData(chain.address);
            }
          } catch (error) {
            console.log("error----->", error);
            Toast.show({ icon: "fail", content: "交易取消", duration: 700 });
          }
        } else {
          Toast.show({ icon: "fail", content: "服务器出错", duration: 700 });
        }
      } catch (error) {
        loading.hidden();
        Toast.show({ icon: "fail", content: "领取失败", duration: 700 });
      }
    }
  }, [chain.address]);
  const closeGainWindow = React.useCallback(() => {
    setGainDisplay("none");
  }, []);
  React.useEffect(() => {
    if (chain.address) {
      chain.getData();
      server.homepageData(chain.address);
      server.requestServerData();
    }
  }, [chain.address]);
  function toBuy() {
    document.getElementById("content").scrollTop = 0;
    history.push({ pathname: "/buy" });
  }
  function subscribe() {
    history.push("/subscribe");
    document.getElementById("content").scrollTop = 0;
  }
  function getRecord() {
    history.push("/record");
    document.getElementById("content").scrollTop = 0;
  }
  function earningsRecord() {
    history.push("/earningsRecord");
  }
  // 说明弹窗
  function showExplain() {
    setExplainDisplay("unset");
  }
  function closeExplainWindow() {
    setExplainDisplay("none");
  }
  // 公告弹窗
  // useEffect(() => {
  //   if (server.noticeList.length > 0) {
  //     const { id } = server.noticeList[0];
  //     const getNoticeId = localStorage.getItem("notice");
  //     if (id + "" === getNoticeId) {
  //     } else {
  //       setNoticeDisplay("unset");
  //     }
  //   }
  // }, [server.noticeList]);
  // 注册弹窗
  React.useEffect(() => {
    setTimeout(() => {
      if (
        chain.bindParnet === "0x0000000000000000000000000000000000000000" &&
        chain.address
      ) {
        setDisplay("unset");
      } else {
        setDisplay("none");
      }
    }, 1000);
  }, [chain.address, chain.bindParnet]);
  const closeActivate = useCallback(() => {
    setDisplay("none");
  }, []);
  React.useEffect(() => {
    const sharer = getQueryString("sharer");
    if (!!sharer) chain.setSharer(sharer);
  }, []);
  function closeNoticeWindow() {
    const { id } = server.noticeList[0];
    localStorage.setItem("notice", id);
    setNoticeDisplay("none");
  }
  function renderWindow() {
    if (explainDisplay === "unset") {
      return (
        <div>
          <ExplainWindow
            closeExplainWindow={closeExplainWindow}
            home_usdt_static={home_usdt_static}
            home_usdt_dynamic={home_usdt_dynamic}
          />
        </div>
      );
    }
    if (gainDisplay === "unset") {
      return (
        <div>
          <HomeGainWindow closeGainWindow={closeGainWindow} />
        </div>
      );
    }
    if (noticeDisplay === "unset") {
      return (
        <div>
          <NoticeWindow closeNoticeWindow={closeNoticeWindow} />
        </div>
      );
    }
    if (display === "unset") {
      return (
        <div style={{ display: display }}>
          <Activate closeActivate={closeActivate} />
        </div>
      );
    }
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.inner}>
          {/* 领取收益 */}
          <div className={css.gain}>
            <div className={css.gainInner}>
              <div className={css.gainLeft}>
                <div className={css.gainLeftTitle}>
                  <span>待领取收益</span>
                  <span className={css.explain} onClick={showExplain}></span>
                </div>
                <div className={css.willGain}>
                  <div className={css.willGainNum}>{home_usdt}</div>
                  <div className={css.willGainUnit}> USDT</div>
                </div>
                <div className={css.equal}>≈ ${interception(home_usdt, 4)}</div>
              </div>
              <div
                className={css.gainRight}
                onClick={() => {
                  if (home_usdt > 0 || home_beans > 0) {
                    handleGain();
                  } else {
                    Toast.show({
                      content: `暂无收益`,
                      duration: 1000,
                    });
                  }
                }}
              >
                收获
              </div>
            </div>
            <div className={css.gainBottom}>
              <div className={css.willGet}>
                <div className={css.innerLeft}>
                  <div className={css.top}>
                    <div className={css.topImg}></div>
                    <div className={css.topTitle}>待领取金豆</div>
                  </div>
                  <div className={css.bottom}>
                    <span className={css.bottomNum}>{home_beans}</span>
                  </div>
                </div>
              </div>
              <div className={css.alreadyGet}>
                <div className={css.innerRight}>
                  <div className={css.top}>
                    <div className={css.topImg_teamReturns}></div>
                    <div className={css.topTitle}>已领取金豆</div>
                  </div>
                  <div className={css.bottom}>
                    <span className={css.bottomNum}>{home_beans_already}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={css.team}>
              <div className={css.teamInner}>
                <div className={css.top}>
                  <div className={css.topImg}></div>
                  <div className={css.topTitle}>待领取本金</div>
                </div>
                <div className={css.bottom}>
                  <span className={css.bottomNum}>{home_principal}</span>
                </div>
              </div>
            </div>
            <div className={css.earningsRecord} onClick={earningsRecord}>
              收益记录
            </div>
          </div>
          {/* 立即认购 */}
          <div className={css.buyBox}>
            <div className={css.buyInner}>
              <div className={css.title}>
                <div className={css.left}>
                  当前轮次：第{" "}
                  <span className={css.nper}>{currentEpochId}</span> 轮{" "}
                  <span className={css.nper}>
                    {currentSlotId.toString().padStart(3, 0)}
                  </span>{" "}
                  期
                </div>
                <div className={css.right}>
                  {_LeftLimit - _min >= 0 ? "筹备中" : "确认中"}
                </div>
              </div>
              <div className={css.bottomBorder}></div>
              <div className={css.line}>
                <div className={css.left}>本期总量</div>
                <div className={css.right}>
                  <span className={css.number}>{_Limit}</span>
                  <span className={css.unit}>USDT</span>
                </div>
              </div>
              <div className={css.bottomBorder}></div>
              <div className={css.line}>
                <div className={css.left}>剩余</div>
                <div className={css.right}>
                  <span className={css.number}>
                    {_LeftLimit - _min >= 0 ? _LeftLimit : 0}
                  </span>
                  <span className={css.unit}>USDT</span>
                </div>
              </div>
              <div className={css.bottomBorder}></div>
              <div className={css.line}>
                <div className={css.left}>本期结束倒计时</div>
                <div className={css.right}>
                  <span className={css.number}>{date.hour}</span>
                  <span className={css.timeunit}>小时</span>
                  <span className={css.number}>{date.minutes}</span>
                  <span className={css.timeunit}>分</span>
                  <span className={css.number}>{date.seconds}</span>
                  <span className={css.timeunit}>秒</span>
                </div>
              </div>
              <div className={css.figure}>
                <div
                  className={css.rate}
                  style={{
                    width:
                      (_LeftLimit - _min >= 0
                        ? (_Limit - _LeftLimit) / _Limit
                        : 1) *
                        100 +
                      "%",
                  }}
                ></div>
              </div>
              {/* 按钮 */}
              <div
                className={css.buy}
                onClick={() => {
                  if (
                    chain.address &&
                    chain.bindParnet !==
                      "0x0000000000000000000000000000000000000000" &&
                    _LeftLimit - _min >= 0
                  ) {
                    toBuy();
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
                  } else if (_LeftLimit - _min < 0) {
                    Toast.show({
                      icon: "fail",
                      content: "当前期已售罄",
                      duration: 700,
                    });
                  }
                }}
              >
                立即认购
              </div>
              <div className={css.jump}>
                <div className={css.record} onClick={subscribe}>
                  我要预约
                </div>
                <div className={css.record} onClick={getRecord}>
                  参与记录
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

export default inject("chain", "server")(observer(Home));
