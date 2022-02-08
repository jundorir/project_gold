import React,{useEffect} from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";

function EarningsRecord(props) {
  const { chain, earningsList } = props;
  const { list, hasMore } = earningsList;
  function renderList() {
    if (list.length > 0) {
      return list.map((item, index) => {
        return (
          <div className={css.box} key={index}>
            <div className={css.boxInner}>
              <div className={css.title}>
                第 &nbsp;
                <span className={css.number}>{item.epoch}</span>
                &nbsp;轮 &nbsp;
                <span className={css.number}>
                  {(item.slot + "").padStart(3, 0)}
                </span>
                &nbsp;期
              </div>
              <div className={css.divider}></div>
              <div className={css.line}>
                <div className={css.left}>参与金额</div>
                <div className={css.right}>
                  <span className={css.number}>{item.principal}</span>USDT
                </div>
              </div>
              <div className={css.divider}></div>
              {item.type === "static" ? (
                <div className={css.line}>
                  <div className={css.left}>静态收益（已发放）</div>
                  <div className={css.right}>
                    <span className={css.number}>{item.usdt}</span>USDT
                  </div>
                </div>
              ) : (
                <div className={css.lineDynamic}>
                  <div className={css.left}>动态收益（已发放）</div>
                  <div className={css.right}>
                    <div>
                      <span className={css.number}>{item.usdt}</span>
                      USDT
                    </div>
                    <div className={css.symbol}>+</div>
                    <div>
                      <span className={css.number}>{item.beans}</span>
                      金&nbsp;&nbsp;&nbsp;豆
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      });
    }
  }
  async function loadMore() {
    earningsList.nextPage();
  }
  async function refresh() {
    earningsList.refresh();
  }
  useEffect(()=>{
    earningsList.init()
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

export default inject("chain", "earningsList")(observer(EarningsRecord));
