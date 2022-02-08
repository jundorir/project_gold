import React, { Fragment, useEffect } from "react";
import RecordItem from "./RecordItem";
import RecordDetail from "./RecordDetail";
import MySubscribe from "./MySubscribe";
import css from "./index.module.less";
import classnames from "classnames";
import { inject, observer } from "mobx-react";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";

function Record(props) {
  const { chain, attendList, mySubscribeList } = props;
  const { list_attend, hasMore_attend } = attendList;
  const { list_mySubscribe, hasMore_mySubscribe } = mySubscribeList;
  const [view, setView] = React.useState(0);
  const [item, setItem] = React.useState(0);
  const options = ["我的参与", "我的预约"];
  function renderView() {
    if (item === 0) {
      return list_attend.map((item, index) => {
        return <RecordItem key={index} data={{ ...item }} />;
      });
    }
    // if (view === 1 && item === 0) {
    //   return <RecordDetail />;
    // }
    if (item === 1) {
      return list_mySubscribe.map((item, index) => {
        return <MySubscribe key={index} data={{ ...item }} />;
      });
    }
    return null;
  }
  async function loadMoreAttendList() {
    attendList.nextPage();
  }
  async function refreshAttendList() {
    attendList.refresh();
  }
  async function loadMoreMySubscribeList() {
    mySubscribeList.nextPage();
  }
  async function refreshMySubscribeList() {
    mySubscribeList.refresh();
  }
  useEffect(() => {
    attendList.init();
  }, []);
  return (
    <Fragment>
      <div className={css.checkItem}>
        {options.map((data, index) => {
          return (
            <div
              key={index}
              className={classnames(css.item, item === index && css.checked)}
              onClick={() => {
                if (index === 1) {
                  // console.log("我的预约");
                  mySubscribeList.init();
                } else if (index === 0) {
                  // console.log("我的参与");
                  attendList.init();
                }
                setItem(index);
              }}
            >
              {data}
              <div className={css.line} />
            </div>
          );
        })}
      </div>
      <div className={css.record}>
        <PullToRefresh
          onRefresh={item === 0 ? refreshAttendList : refreshMySubscribeList}
        >
          {renderView()}
        </PullToRefresh>
        <InfiniteScroll
          loadMore={item === 0 ? loadMoreAttendList : loadMoreMySubscribeList}
          hasMore={
            chain.address && (item === 0 ? hasMore_attend : hasMore_mySubscribe)
          }
        />
      </div>
    </Fragment>
  );
}

export default inject(
  "chain",
  "attendList",
  "mySubscribeList"
)(observer(Record));
