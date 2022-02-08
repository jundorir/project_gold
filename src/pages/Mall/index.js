import React from "react";
import css from "./index.module.less";
import uncheck from "@assets/images/mall/uncheck.png";
import checked from "@assets/images/mall/checked.png";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { Toast } from "antd-mobile";
function Mall(props) {
  const { chain, order, goods } = props;
  const history = useHistory();
  const { goldBeanBalance } = chain;
  const { showAll } = goods;

  React.useEffect(() => {
    goods.queryGoodsList();
  }, [goods]);

  React.useEffect(() => {
    if (chain.address) {
      queryGoldBeanBalance();
    }
  }, [chain.address]);

  function queryGoldBeanBalance() {
    chain.getGoldBeanBalance();
  }

  function mySwap() {
    if (!chain.address) {
      Toast.show("请先登录");
      return;
    }
    history.push("/order");
    document.getElementById("content").scrollTop = 0;
  }
  function myAddress() {
    if (!chain.address) {
      Toast.show("请先登录");
      return;
    }
    history.push("/address");
    document.getElementById("content").scrollTop = 0;
  }
  function createOrder(goodsInfo) {
    if (!chain.address) {
      Toast.show("请先登录");
      return;
    }
    order.setExchangeGoods(goodsInfo);
    history.push("/createOrder");
    document.getElementById("content").scrollTop = 0;
  }
  function change() {
    goods.changeShowAll();
  }
  function renderList() {
    return goods.list.map((goodsInfo) => {
      const { beans, name, stock, id, image } = goodsInfo;
      if (!showAll && goldBeanBalance - beans < 0) {
        return null;
      }
      return (
        <div
          className={css.listBox}
          key={id}
          onClick={() => {
            createOrder(goodsInfo);
          }}
        >
          <div className={css.listBoxinner}>
            <div className={css.left}>
              <div className={css.imgBox}>
                <img src={image} alt="" className={css.img} />
              </div>
              <div className={css.name}>
                <div className={css.nameTop}>{name}</div>
                <div className={css.nameBottom}>库存：{stock}件</div>
              </div>
            </div>
            <div className={css.right}>
              <div className={css.number}>{beans}</div>
              <div className={css.unit}>金豆</div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.gain}>
          <div className={css.gainInner}>
            <div className={css.gainLeft}>
              <div>剩余可用金豆</div>
              <div className={css.willGain}>
                <span className={css.willGainNum}>{goldBeanBalance}</span>
              </div>
            </div>
            <div className={css.gainRight}></div>
          </div>
        </div>
        {/* 我的兑换/我的地址*/}
        <div className={css.dataTop}>
          <div className={css.dataTopBox} onClick={mySwap}>
            <div className={css.topImg}></div>
            <div className={css.bottom}>我的兑换</div>
          </div>
          <div className={css.dataTopBox} onClick={myAddress}>
            <div className={css.topImg_teamReturns}></div>
            <div className={css.bottom}>我的地址</div>
          </div>
        </div>
        {/* 黄金商品 */}
        <div className={css.mallTitle}>
          <div className={css.left}>黄金商品</div>
          <div className={css.right} onClick={change}>
            <img
              src={showAll ? uncheck : checked}
              alt=""
              className={css.cicle}
            />
            我可以兑换的
          </div>
        </div>
        {renderList()}
      </div>
    </div>
  );
}

export default inject("chain", "order", "goods")(observer(Mall));
