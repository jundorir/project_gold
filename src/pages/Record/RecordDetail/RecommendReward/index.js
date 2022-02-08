import React from "react";
import css from "./index.module.less";
import RecommendRewardItem from "./RecommendRewardItem";
function RecommendReward() {
  return (
    <div className={css.recommendReward}>
      <RecommendRewardItem />
      <RecommendRewardItem />
    </div>
  );
}

export default RecommendReward;
