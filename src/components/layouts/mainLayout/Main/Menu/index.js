import MenuItem from "./MenuItem";
import css from "./index.module.less";
import { useLocation } from "react-router-dom";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import routes from "@common/const/routes";
import React from "react";
import home from "@assets/images/menu/home.png";
import record from "@assets/images/menu/record.png";
import community from "@assets/images/menu/community.png";
import invitation from "@assets/images/menu/invitation.png";
import notice from "@assets/images/menu/notice.png";
import mall from "@assets/images/menu/mall.png";
import copyIcon from "@assets/images/menu/copy.png";

import homeActive from "@assets/images/menu/home_active.png";
import recordActive from "@assets/images/menu/record_active.png";
import communityActive from "@assets/images/menu/community_active.png";
import invitationActive from "@assets/images/menu/invitation_active.png";
import noticeActive from "@assets/images/menu/notice_active.png";
import mallActive from "@assets/images/menu/mall_active.png";
import { inject, observer } from "mobx-react";
import RegisterWindow from "@components/RegisterWindow";
import SwapModal from "@components/SwapModal";

const ICON = {
  home,
  record,
  community,
  invitation,
  notice,
  mall,
};
const ICON_ACTIVE = {
  home: homeActive,
  record: recordActive,
  community: communityActive,
  invitation: invitationActive,
  notice: noticeActive,
  mall: mallActive,
};

function Menu(props) {
  const location = useLocation();
  const [showModal, setShowModal] = React.useState("");

  const { view, chain, server } = props;
  /**
   * 渲染 menu树
   */
  function renderMenuList(startIndex, endIndex) {
    let array = routes.slice(startIndex, endIndex);
    return array.map((route, index) => {
      let right = null;
      let isLast = array.length === index + 1;
      return (
        <MenuItem
          key={route.path}
          {...route}
          icon={ICON[route.icon]}
          activeIcon={ICON_ACTIVE[route.icon]}
          pathname={location.pathname}
          right={right}
          isLast={isLast}
        />
      );
    });
  }

  function copy() {
    if (chain.address !== "") {
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = chain.address;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      Toast.show({ icon: "success", content: "复制成功", duration: 700 });
    } else {
      Toast.show({ icon: "fail", content: "复制失败", duration: 700 });
    }
  }
  // 激活弹窗
  const closeModal = React.useCallback(() => {
    setShowModal("");
  }, []);
  const showActiveModal = React.useCallback(() => {
    setShowModal("active");
  }, []);
  const showExchangeModal = React.useCallback(() => {
    setShowModal("exchange");
  }, []);

  function renderModal() {
    if (showModal === "exchange") {
      return <SwapModal closeModal={closeModal} />;
    }

    if (showModal === "active") {
      return <RegisterWindow closeActivate={closeModal} />;
    }
    return null;
  }

  return (
    <>
      <div
        className={classNames(css.siderContent, !view.collapsed && css.active)}
        onClick={() => {
          if (window.innerWidth <= 960) {
            view.changeCollapsed(true);
          }
        }}
      >
        <div className={classNames(css.sider)}>
          <div
            className={css.siderBox}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={css.info}>
              {chain.address === "" ? (
                <div className={css.login} onClick={() => chain.login()}>
                  Connect
                </div>
              ) : (
                <>
                  <div className={css.address}>
                    {chain.quiteAddress?.quiteAddress}{" "}
                    <span
                      className={css.copy}
                      onClick={() => {
                        copy();
                      }}
                    >
                      <img src={copyIcon} alt={""} className={css.image} />
                    </span>
                  </div>
                  <div className={css.operation}>
                    <div className={css.activate}>
                      状态：
                      {chain.isActive ? "激活" : "未激活"}
                    </div>
                    {chain.bindParnet ===
                      "0x0000000000000000000000000000000000000000" && (
                      <div className={css.right} onClick={showActiveModal}>
                        激活
                      </div>
                    )}
                    <div>级别：G{server.level}</div>
                  </div>
                  <div className={css.status}>
                    <div className={css.left}>
                      金豆余额：{chain.goldBeanBalance}
                    </div>
                    <div className={css.right} onClick={showExchangeModal}>
                      兑换
                    </div>
                  </div>
                </>
              )}
            </div>
            <nav
              className={classNames(css.menu)}
              onClick={() => {
                if (window.innerWidth <= 960) {
                  view.changeCollapsed(true);
                }
              }}
            >
              {renderMenuList(0, 10)}
            </nav>
          </div>
        </div>
      </div>
      {renderModal()}
    </>
  );
}

export default inject("view", "chain", "server")(observer(Menu));
