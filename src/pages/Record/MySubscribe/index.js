import React from "react";
import css from "./index.module.less";
import classNames from "classnames";
function MySubscribe(props) {
  const { data } = props;
  const { epoch, slot, status, usdt, usdt_already } = data;
  const statusMap = ["已预约", "已参与", "已退定金", "预约失败"];
  function renderLine() {
    const lineData = [
      {
        key: 1,
        title: "预约金额",
        amount: usdt,
      },
      {
        key: 2,
        title: "已付金额",
        amount: usdt_already,
      },
    ];

    return lineData.map((item) => {
      return (
        <div className={css.line} key={item.key}>
          <div className={css.left}>{item.title}</div>
          <div className={css.right}>
            <div className={css.price}>{item.amount}</div>
            <div className={css.symbol}>USDT</div>
          </div>
        </div>
      );
    });
  }
  return (
    <div className={css.recordItemBox}>
      <div className={css.recordItem}>
        <div className={css.round}>
          <div className={css.left}>
            第<div className={css.emphasize}>{epoch}</div>轮
            <div className={css.emphasize}>{(slot + "").padStart(3, "0")}</div>
            期
          </div>
          <div
            className={classNames(css.right, status - 0 === 3 && css.redword)}
          >
            {statusMap[status]}
          </div>
        </div>
        {renderLine()}
        <div className={classNames(css.tips, status - 0 === 3 && css.redword)}>
          {status - 0 === 3
            ? "失败原因：未及时支付尾款，预约失败"
            : "说明：请务必保证账户余额充足"}
        </div>
      </div>
    </div>
  );
}

export default MySubscribe;
