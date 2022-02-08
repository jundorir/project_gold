import React, { useState } from "react";
import css from "./index.module.less";
import classNames from "classnames";
import OrderItem from "./OrderItem";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { sleep } from "antd-mobile/es/utils/sleep";

function Order(props) {
  const { chain, order } = props;
  const { tabs, tab, list, tabTitle, hasMore } = order;

  React.useEffect(() => {
    if (chain.address) {
      order.init(9);
    }
  }, [chain.address]);

  function renderList() {
    if (list.length > 0) {
      return list.map((item, index) => (
        <OrderItem key={`${item.order_sn}_${index}`} {...item} />
      ));
    }
    return null;
  }

  async function loadMore() {
    await sleep(1000);
    order.nextPage();
  }

  async function refresh() {
    order.refresh();
  }

  return (
    <div className={css.order}>
      <div className={css.tabs}>
        {tabs.map((item) => {
          return (
            <div
              className={classNames(css.tab, tab === item && css.selected)}
              key={item}
              onClick={() => {
                order.changeTab(item);
              }}
            >
              {tabTitle[item]}
              <div className={css.line} />
            </div>
          );
        })}
      </div>
      <PullToRefresh onRefresh={refresh}>
        <div className={css.list}>{renderList()}</div>
      </PullToRefresh>
      <InfiniteScroll loadMore={loadMore} hasMore={chain.address && hasMore} />
    </div>
  );
}

export default inject("chain", "order")(observer(Order));
