import css from "./index.module.less";
import more from "@assets/images/icon/more.png";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

function Header(props) {
  const { view, chain, title } = props;

  function login() {
    if (chain.address === "") {
      chain.login();
    }
  }
  return (
    <div className={classNames(css.header)}>
      <div className={css.content}>
        <div className={css.box}>
          <div className={css.left}>
            <div className={css.bar}>
              <img
                src={more}
                alt="more"
                className={css.image}
                onClick={() => {
                  view.changeCollapsed();
                }}
              />
            </div>
          </div>
          <div className={css.middle}>
            <div className={css.title}>{title["SimplifiedChinese"]}</div>
          </div>
          <div className={css.right}>
            <div
              className={css.wallet}
              onClick={() => {
                login();
              }}
            >
              {chain.address === "" ? "Connect" : chain.quiteAddress?.headerAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("view", "chain")(observer(Header));
