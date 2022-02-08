import React, { useRef } from "react";
import css from "./index.module.less";
import close from "@assets/images/icon/close.png";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { getQueryString } from "@utils/common";
import loading from "@utils/loading";
import classNames from "classnames";

function Activate(props) {
  const inputEle = useRef();
  const { chain } = props;
  const closeWindow = React.useCallback(() => {
    inputEle.current.value = "";
    props.closeActivate();
  }, [props]);
  // 获取上级地址
  // 跟邀请人   0x657780bE55feC992c827fB92be38ece55f0A9D1e
  React.useEffect(() => {
    const sharer = getQueryString("sharer");
    if (!!sharer) chain.setSharer(sharer);
  }, []);
  // 确定按钮
  const handleAgree = React.useCallback(async () => {
    const content = inputEle.current.value.trim();
    try {
      const queryResult = await chain.queryParnetFunction(content);
      if (queryResult === "0x0000000000000000000000000000000000000000") {
        Toast.show({
          icon: "fail",
          content: "邀请人地址未激活",
          duration: 700,
        });
      } else {
        try {
          const result = await chain.bindParnetFunction(content);
          if (result) {
            closeWindow();
            chain.queryBindParent();
            Toast.show({ icon: "success", content: "绑定成功", duration: 700 });
          }
        } catch (error) {
          Toast.show({ icon: "fail", content: "绑定失败", duration: 700 });
          loading.hidden();
        }
      }
    } catch (error) {
      Toast.show({ icon: "fail", content: "邀请人地址不存在", duration: 700 });
      loading.hidden();
    }
  }, [chain, closeWindow]);
  return (
    <div
      className={css.activeWindow}
      onClick={() => {
        closeWindow();
      }}
    >
      <div
        className={css.activeBox}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 关闭按钮 */}
        <div className={css.closeImgBox}>
          <img
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            className={css.closeImg}
            src={close}
            alt=" "
          />
        </div>
        <div className={css.describe}>
          <div className={css.describeTop}>提示</div>
          <div className={css.describeBottpm}>
            您需要授权合约访问您的以下地址
          </div>
        </div>
        {/* 邀请地址 */}
        <div className={css.superior}>
          <input
            placeholder="请输入激活地址"
            className={css.input}
            maxLength="100"
            ref={inputEle}
            defaultValue={chain.sharer}
            disabled={
              chain.sharer && chain.address !== chain.sharer ? true : false
            }
          ></input>
        </div>
        <div className={css.info}>
          <span className={css.infoIcon}>i</span>
          激活地址需要链上确认，请勿重复提交
        </div>
        {/* 确定按钮 */}
        <div
          className={classNames(css.button)}
          onClick={() => {
            if (inputEle.current.value.trim().length > 0) {
              handleAgree();
            } else if (inputEle.current.value.trim().length === 0) {
              Toast.show({ content: "请输入邀请人地址", duration: 700 });
            }
          }}
        >
          确定
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "server")(observer(Activate));
