import React, { useEffect } from "react";
import css from "./index.module.less";
import { quiteAddress } from "@utils/common";
import { inject, observer } from "mobx-react";
import { interception } from "@utils/common";
import { Toast, InfiniteScroll, PullToRefresh } from "antd-mobile";
import copyIcon from "@assets/images/icon/copy_white.png";

function Community(props) {
  const { chain, communityList } = props;
  const { list, hasMore } = communityList;
  function renderList() {
    if (list.length > 0) {
      return list.map((item, index) => {
        return (
          <div className={css.box} key={index}>
            <div className={css.boxInner}>
              <div className={css.address}>
                <div className={css.left}>
                  {quiteAddress(item.user)}{" "}
                  <span
                    className={css.copy}
                    onClick={() => {
                      copy(item.user);
                    }}
                  >
                    <img src={copyIcon} alt={""} className={css.image} />
                  </span>
                </div>
                <div className={css.right}>G{item.level}</div>
              </div>
              <div className={css.divider}></div>
              <div className={css.line}>
                <div className={css.left}>个人业绩</div>
                <div className={css.right}>
                  <span className={css.number}>{item.perf}</span>USDT
                </div>
              </div>
              <div className={css.divider}></div>
              <div className={css.line}>
                <div className={css.left}>团队业绩</div>
                <div className={css.right}>
                  <span className={css.number}>{item.perfTeam}</span>USDT
                </div>
              </div>
              <div className={css.divider}></div>
              <div className={css.time}>
                <div className={css.left}>
                  注册时间：{item.create_time}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  }
  function copy(address) {
    // console.log(address);
    if (address !== "") {
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = address;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      Toast.show({ icon: "success", content: "复制成功", duration: 700 });
    } else {
      Toast.show({ icon: "fail", content: "复制失败", duration: 700 });
    }
  }
  // function timestampToTime(timestamp) {
  //   var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  //   var Y = date.getFullYear() + "-";
  //   var M =
  //     (date.getMonth() + 1 < 10
  //       ? "0" + (date.getMonth() + 1)
  //       : date.getMonth() + 1) + "-";
  //   var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  //   var h =
  //     (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  //   var m =
  //     date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  //   //   +":";
  //   // var s =
  //   //   date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  //   return Y + M + D + h + m;
  // }
  async function loadMore() {
    communityList.nextPage();
  }
  async function refresh() {
    communityList.refresh();
  }
  useEffect(()=>{
    communityList.init()
  },[])
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <PullToRefresh onRefresh={refresh}>{renderList()}</PullToRefresh>
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={chain.address && hasMore}
        />
      </div>
    </div>
  );
}

export default inject("chain", "communityList")(observer(Community));
