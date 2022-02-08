import classNames from "classnames";
import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
function Main(props) {
  return (
    <div className={css.main}>
      <div className={classNames(css.content, css.active)} id="content">
        <div className={css.inner}>{props.children}</div>
      </div>
    </div>
  );
}
export default inject("server")(observer(Main));
