import classNames from "classnames";
import React from "react";
import css from "./index.module.less";
import Menu from "./Menu";
import { inject, observer } from "mobx-react";
function Main(props) {
  const { view } = props;

  return (
    <div className={css.main}>
      <Menu />
      <div
        className={classNames(css.content, view.collapsed && css.active)}
        id="content"
      >
        <div className={css.inner}>{props.children}</div>
        <div className={css.fotter} />
      </div>
    </div>
  );
}
export default inject("view")(observer(Main));
