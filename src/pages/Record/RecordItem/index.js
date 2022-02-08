import React, { useEffect } from "react";
import css from "./index.module.less";
import classNames from "classnames";
function RecordItem(props) {
  const { data } = props;
  /**
   * status:0=众筹中,1=众筹成功,2=众筹失败
   */
  const { epoch, slot, usdt, beans, status, create_time } = data;
  const statusMap = ["众筹中", "众筹成功", "众筹失败"];

  function renderLine() {
    const lineData = [
      {
        key: 1,
        title: "参与金额",
        amount: usdt,
      },
      // {
      //   key: 2,
      //   title: "静态收益(未到账)",
      //   amount: staticIncome,
      // },
      // {
      //   key: 3,
      //   title: "动态收益(未到账)",
      //   amount: dynamicIncome,
      // },
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
    <div
      className={css.recordItemBox}
      // onClick={() => {
      //   props.onClick();
      // }}
    >
      <div className={css.recordItem}>
        <div className={css.round}>
          <div className={css.left}>
            第<div className={css.emphasize}>{epoch}</div>轮
            <div className={css.emphasize}>{(slot + "").padStart(3, "0")}</div>
            期
          </div>
          <div className={classNames(css.right, status === "2" && css.redWord)}>
            {statusMap[status]}
          </div>
        </div>
        {renderLine()}
        {status === "2" ? (
          <div className={css.tips}>
            说明：本期参与金额已全部退还，请前往首页领取
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default RecordItem;
