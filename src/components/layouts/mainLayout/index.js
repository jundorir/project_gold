import React from "react";
import Header from "./Header";
import Main from "./Main";
import SecondaryHeader from "./SecondaryHeader";
import css from "./index.module.less";
import { FirstRoutesMap, SecondaryRoutesMap } from "@common/const/routes";
import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";

const MainLayout = ({ children }) => {
  // 选中的路由，及其夫路由集合，
  // 没有选中的route 则默认选中第一个

  function renderHeader() {
    let pathname = children.props.location.pathname;
    if (pathname.includes("/editAddress/")) {
      pathname = "/editAddress/";
    }
    if (pathname.includes("/subscribe/buy")) {
      pathname = "/subscribe/buy";
    }
    if (pathname.includes("/noticeDetail/")) {
      pathname = "/noticeDetail/";
    }
    if (SecondaryRoutesMap.has(pathname)) {
      const route = SecondaryRoutesMap.get(pathname);
      return (
        <SecondaryHeader title={route?.label} parent={route?.parentPath} />
      );
    }
    const route = FirstRoutesMap.get(pathname);
    return <Header title={route?.label} />;
  }

  return (
    <div className={css.layout}>
      {renderHeader()}
      <Main>{children}</Main>
    </div>
  );
};

export default inject("view")(observer(MainLayout));
