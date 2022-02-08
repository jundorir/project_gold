import React from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close_white.png";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";

function GainWindow(props) {
  const { chain, server } = props;
  const { noticeList } = server;
  const [detailNotice, setDetailNotice] = React.useState({
    title: "头矿来了！错过等一年",
    content:
      "游戏的适配非常重要！适配没调整好，整个游戏的视觉还原度不会高于60%，平台应用都是列表形式的，可以往下滑查看更多内容，因为它可以有【负1屏】，但游戏只有【1屏】，不管手机屏幕有多大，都需要把所有的内容全部塞进这一个屏幕内，所以前期就要把适配规范建立好，并与研发同学同步。",
    create_time_ymd: "2021-06-02",
  });
  React.useEffect(() => {
    server.queryNotice();
  }, []);
  const closeWindow = React.useCallback(() => {
    props.closeNoticeWindow();
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
        <div className={css.inner}>
          <div className={css.title}>{noticeList[0].title}</div>
          <div className={css.time}>{noticeList[0].create_time}</div>
          <div
            className={css.content}
            dangerouslySetInnerHTML={{ __html: noticeList[0].content }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "server")(observer(GainWindow));
