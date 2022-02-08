import React, { useState } from "react";
import css from "./index.module.less";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { useHistory } from "react-router-dom";

function AddAddress(props) {
  const { addressManager } = props;
  const [consignee, setConsignee] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [detailed, setDetailed] = useState("");
  const [checked, setChecked] = useState("家");
  const [isopen, setIsopen] = useState(1);
  const history = useHistory();

  function handleCheck(option) {
    setChecked(option);
  }
  function openhandle() {
    setIsopen(1 - isopen);
  }
  function checkParams() {
    let msg = "";
    if (!consignee) {
      msg = "请输入收货人姓名";
    } else if (!phone.match(reg_tel)) {
      msg = "请输入正确的手机号码";
    } else if (!area) {
      msg = "请输入所在地区";
    } else if (!detailed) {
      msg = "请输入详细地址";
    }
    return msg;
  }
  async function save() {
    const msg = checkParams();
    if (!!msg) {
      Toast.show({
        icon: "fail",
        content: msg,
        duration: 700,
      });
      return;
    }
    const result = await addressManager.addAddress({
      area,
      address: detailed,
      name: consignee,
      mobile: phone,
      lable: checked,
      isDefault: isopen,
    });
    let toast = {
      icon: "fail",
      content: "添加失败",
    };
    if (result) {
      toast = {
        icon: "success",
        content: "添加成功",
      };
      history.goBack();
      document.getElementById("content").scrollTop = 0;
    }

    Toast.show({
      ...toast,
      duration: 700,
    });
  }

  var reg_tel =
    /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.top}>
          <div className={css.topInner}>
            <div className={css.line}>
              <div className={css.left}>收货人</div>
              <div className={css.right}>
                <input
                  maxLength="10"
                  placeholder="请填写收货人"
                  className={css.input}
                  value={consignee}
                  onChange={(e) => {
                    setConsignee(e.target.value.trim());
                  }}
                />
              </div>
            </div>
            <div className={css.divider}></div>
            <div className={css.line}>
              <div className={css.left}>手机号码</div>
              <div className={css.right}>
                <input
                  type="number"
                  maxLength="11"
                  placeholder="请填写手机号码"
                  className={css.input}
                  value={phone}
                  onChange={(e) => {
                    if (e.target.value.substring(0, 1) !== "1") {
                      e.target.value = "";
                    }
                    setPhone(e.target.value.trim().substring(0, 11));
                  }}
                />
              </div>
            </div>
            <div className={css.divider}></div>
            <div className={css.line}>
              <div className={css.left}>所在地区</div>
              <div className={css.right}>
                <input
                  maxLength="100"
                  placeholder="请填写所在地区"
                  className={css.input}
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value.trim());
                  }}
                />
              </div>
            </div>
            <div className={css.divider}></div>
            <div className={css.detailLine}>
              <div className={css.left}>详细地址</div>
              <div className={css.detailLineright}>
                <input
                  maxLength="200"
                  placeholder="请填写详细地址"
                  className={css.input}
                  value={detailed}
                  onChange={(e) => {
                    setDetailed(e.target.value.trim());
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={css.bottom}>
          <div className={css.bottomInner}>
            <div className={css.line}>
              <div className={css.left}>地址标签</div>
              <div className={css.checkRight}>
                <div
                  className={classNames(
                    css.option,
                    checked === "家" && css.checked
                  )}
                  onClick={() => {
                    handleCheck("家");
                  }}
                >
                  家
                </div>
                <div
                  className={classNames(
                    css.option,
                    checked === "公司" && css.checked
                  )}
                  onClick={() => {
                    handleCheck("公司");
                  }}
                >
                  公司
                </div>
                <div
                  className={classNames(
                    css.option,
                    checked === "其他" && css.checked
                  )}
                  onClick={() => {
                    handleCheck("其他");
                  }}
                >
                  其他
                </div>
              </div>
            </div>
            <div className={css.divider}></div>
            <div className={css.lastLine}>
              <div className={css.left}>
                <div className={css.leftTop}>设为默认地址</div>
                <div className={css.leftBottom}>每次下单会使用该地址</div>
              </div>
              <div
                className={classNames(
                  css.lastLineRight,
                  !!isopen ? css.open : css.close
                )}
                onClick={openhandle}
              >
                <div className={css.ball}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={css.button} onClick={save}>
          保存
        </div>
      </div>
    </div>
  );
}

export default inject("addressManager")(observer(AddAddress));
