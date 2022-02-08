import React from "react";
import css from "./index.module.less";
import classNames from "classnames";
function RecommendReward(props) {
  const { status = 0 } = props;
  const statusMap = ["未发放", "已发放"];

  return (
    <div className={css.recommendRewardItem}>
      <div className={css.type}>
        <div className={css.left}>类型：推荐分享</div>
        <div className={css.right}>{statusMap[status]}</div>
      </div>
      <div className={css.line}>
        <div className={css.item}>
          <div className={css.top}>资产:</div>
          <div className={css.bottom}>
            <div className={css.amount}>1200</div>
            USDT
          </div>
        </div>
        <div className={classNames(css.item, css.right)}>
          <div className={css.top}>奖励深度:</div>
          <div className={css.bottom}>
            <div className={css.amount}>1200</div>
          </div>
        </div>
      </div>
      <div className={css.line}>
        <div className={css.left}>预计发放轮次:</div>
        <div className={classNames(css.right, css.noAlpha)}>8</div>
      </div>
      <div className={css.line}>
        <div className={css.left}>时间:</div>
        <div className={css.right}>2019-02-04 09:30:24</div>
      </div>
    </div>
  );
}

export default RecommendReward;
