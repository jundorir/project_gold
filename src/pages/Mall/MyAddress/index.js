import React, { Fragment } from "react";
import css from "./index.module.less";
import modify from "@assets/images/mall/modify.png";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";

function MyAddress(props) {
  const { addressManager, chain } = props;
  const history = useHistory();

  React.useEffect(() => {
    if (chain.address) addressManager.queryAddress();
  }, [chain.address]);

  function handleEdit(id) {
    // console.log(`/editAddress/:${id}`);
    history.push({ pathname: `/editAddress/${id}` });
    document.getElementById("content").scrollTop = 0;
  }
  function renderList() {
    let data = [...addressManager.list];
    if (data.length === 0) {
      return (
        <Fragment>
          <div className={css.noAddress}></div>
          <div className={css.word}>暂无地址</div>
        </Fragment>
      );
    }

    return data.map((item) => {
      const label = item.isDefault === "1" ? "默认" : item.lable;
      return (
        <div className={css.box} key={item.id}>
          <div className={css.boxInner}>
            <div className={css.left}>
              <div className={css.top}>
                <div className={css.topName}>{item.name}</div>
                <div className={css.topTel}>
                  {item.mobile.substring(0, 3)}****{item.mobile.substring(7)}
                </div>
                <div
                  className={classNames(
                    css.topTag,
                    item.isDefault === "1" ? css.default : ""
                  )}
                >
                  {label}
                </div>
              </div>
              <div className={css.bottom}>
                {item.area}
                {item.address}
              </div>
            </div>
            <div
              className={css.right}
              onClick={() => {
                handleEdit(item.id);
              }}
            >
              <img src={modify} alt="" className={css.modify} />
            </div>
          </div>
        </div>
      );
    });
  }
  function addAddress() {
    history.push("/addAddress");
    document.getElementById("content").scrollTop = 0;
  }
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.address}>{renderList()}</div>
        <div className={css.buton} onClick={addAddress}>
          新增地址
        </div>
      </div>
    </div>
  );
}

export default inject("addressManager", "chain")(observer(MyAddress));
