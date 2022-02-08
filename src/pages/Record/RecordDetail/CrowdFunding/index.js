import React from "react";
import css from "./index.module.less";
function CrowdFunding() {
  return (
    <div className={css.crowdFunding}>
      <div className={css.header}>
        <div className={css.round}>轮次</div>
        <div className={css.price}>单次认购</div>
        <div className={css.time}>认购时间</div>
      </div>
      <div className={css.list}>
        <div className={css.item}>
          <div className={css.round}>
            第<div className={css.number}>1</div>轮
          </div>
          <div className={css.price}>
            <div className={css.amount}>1.000000</div>USDT
          </div>
          <div className={css.time}>08-26 09:54</div>
        </div>
        <div className={css.item}>
          <div className={css.round}>
            第<div className={css.number}>1</div>轮
          </div>
          <div className={css.price}>
            <div className={css.amount}>101.000000</div>USDT
          </div>
          <div className={css.time}>08-26 09:54</div>
        </div>
        <div className={css.item}>
          <div className={css.round}>
            第<div className={css.number}>1</div>轮
          </div>
          <div className={css.price}>
            <div className={css.amount}>11.000000</div>USDT
          </div>
          <div className={css.time}>08-26 09:54</div>
        </div>
      </div>
    </div>
  );
}

export default CrowdFunding;
