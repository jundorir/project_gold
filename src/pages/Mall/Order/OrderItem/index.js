import css from "./index.module.less";
import React from "react";
import classNames from "classnames";
import Button from "@components/Button";
import { host } from "@common/const";
import { desensitization } from "@utils/common";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { DownFill } from "antd-mobile-icons";
function OrderItem(props) {
  const {
    order,
    address_area,
    address_address,
    address_mobile,
    address_name,
    beans,
    beans_total,
    complate_time,
    create_time,
    express_number,
    goods_image,
    goods_name,
    goods_num = 1,
    order_sn,
    status, // 0, 1,2
  } = props;
  const statusMap = ["待发货", "待签收", "已完成"];
  const [open, setOpen] = React.useState(false);

  async function handleReceive() {
    const result = await order.confirmOrder(order_sn);
    if (result) {
      Toast.show({
        icon: "success",
        content: "收货成功",
      });
    } else {
      Toast.show({
        icon: "fail",
        content: "收货失败",
      });
    }
  }

  function handleViewLogistics() {
    window.open(
      `https://m.kuaidi100.com/result.jsp?nu=${express_number}`,
      "_blank"
    );
  }

  function renderOperation() {
    if (status === "0") return null;

    return (
      <div className={css.operation}>
        <Button
          title="查看物流"
          className={css.showLogistics}
          onClick={handleViewLogistics}
        />
        {status === "1" && (
          <Button
            title="确认收货"
            className={css.submitReceive}
            onClick={handleReceive}
          />
        )}
      </div>
    );
  }
  return (
    <div className={css.orderItem}>
      <div className={css.orderItemPaddingBox}>
        <div className={css.round}>
          <div className={css.left}>兑换编号：{order_sn}</div>
          <div className={css.right}>{statusMap[status]}</div>
        </div>
        <div className={css.goods}>
          <div className={css.imgBox}>
            <img src={host + goods_image} alt="" className={css.img} />
          </div>
          <div className={css.info}>
            <div className={css.top}>
              <div>{goods_name}</div>
              <div>
                {beans} <span className={css.alphaText}>金豆</span>
              </div>
            </div>
            <div className={css.middle}>
              <span className={css.alphaText}>兑换数量:</span> {goods_num}件
            </div>
            <div className={css.bottom}>
              <span className={css.alphaText}>兑换时间:</span> {create_time}
            </div>
          </div>
        </div>
        <div className={css.payInfo}>
          <div className={css.alphaText}>共{goods_num}件</div>
          <div className={css.alphaText}>
            实付:<span className={css.priceText}>{beans_total}</span>金豆
          </div>
        </div>
      </div>

      <div className={classNames(css.addressInfo, open && css.open)}>
        <div className={css.tips}>
          <div
            className={css.showAddress}
            onClick={() => {
              setOpen(!open);
            }}
          >
            收货地址
            <DownFill className={classNames(css.triangle, open && css.open)} />
          </div>
          {renderOperation()}
        </div>
        <div className={css.userInfo}>
          <div className={css.name}>{address_name}</div>
          <div className={css.tel}>{desensitization(address_mobile)}</div>
        </div>
        <div className={css.addressDetail}>
          {address_area}
          {address_address}
        </div>
      </div>
      {/* <ViewLogistics /> */}
    </div>
  );
}

export default inject("order")(observer(OrderItem));
