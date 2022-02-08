import React from "react";
// import { withRouter } from "react-router-dom";
import Main from "./Main";
import SecondaryHeader from "./SecondaryHeader";
import css from "./index.module.less";
import { ThirdRoutesMap } from "@common/const/routes";

const PopuLayout = ({ children }) => {
  // 选中的路由，及其夫路由集合，
  // 没有选中的route 则默认选中第一个

  function renderHeader() {
    let pathname = children.props.location.pathname;
    return <SecondaryHeader title={ThirdRoutesMap.get(pathname)} />;
  }
  return (
    <div className={css.layout}>
      {renderHeader()}
      <Main>{children}</Main>
    </div>
  );
};

export default PopuLayout;
