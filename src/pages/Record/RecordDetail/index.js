import React from "react";
import css from "./index.module.less";
import classNames from "classnames";
import CrowdFunding from "./CrowdFunding";
import RecommendReward from "./RecommendReward";
function RecordDetail(props) {
  const [tab, changeTab] = React.useState(0);
  function renderView() {
    if (tab === 0) {
      return <CrowdFunding />;
    }

    if (tab === 1 || tab === 2) {
      return <RecommendReward />;
    }
    return null;
  }
  return (
    <div className={css.recordDetail}>
      <div className={css.tabs}>
        {["我的众筹", "直推奖励", "级差奖励"].map((item, index) => {
          return (
            <div
              className={classNames(css.tab, tab === index && css.selected)}
              key={index}
              onClick={() => {
                changeTab(index);
              }}
            >
              {item}
              <div className={css.line} />
            </div>
          );
        })}
      </div>
      {renderView()}
    </div>
  );
}

export default RecordDetail;
