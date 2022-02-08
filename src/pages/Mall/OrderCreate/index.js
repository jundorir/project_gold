import React from "react";
import css from "./index.module.less";
import { AddOutline, MinusOutline } from "antd-mobile-icons";
import { Input, Button, Toast } from "antd-mobile";
import AddressItem from "./AddressItem";
import EmptyAddress from "./EmptyAddress";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import EmpowerModal from "@components/EmpowerModal";

function OrderCreate(props) {
  const history = useHistory();
  const { order, addressManager, chain } = props;
  const { goldBeanBalance: balance } = chain;
  const { goodsInfo } = order;
  const [GOLDBEAN_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (chain.address && !!goodsInfo) {
      addressManager.queryAddress();
      order.changeBuyAmount(1);
      addressManager.setChoosedAddressId(null);
      queryGoldBeanBalance();
      queryAllowanceAll();
    }
  }, [chain.address, goodsInfo]);

  if (!goodsInfo) {
    history.replace("/mall");
    return null;
  }

  // 授权GOLD
  async function toApprove(symbol) {
    let { status, approveAmount } = await chain.toApprove({
      type: "goldBee",
      symbol,
    });
    if (status) {
      setShowModal(false);
      setApprove(approveAmount);
      Toast.show({ icon: "success", content: "授权成功", duration: 700 });
    } else {
      Toast.show({ icon: "fail", content: "授权失败", duration: 700 });
    }
  }

  async function handleExchange() {
    const goodsAmount = order.buyAmount;
    const totalCost = order.totalCost;
    const addressId = addressManager.choseAddress?.id;
    const goodsId = goodsInfo?.id;
    let msg = "";
    if (goodsAmount <= 0) {
      msg = "请选择购买数量";
    } else if (addressId === undefined) {
      msg = "请添加收货地址";
    } else if (totalCost - balance > 0) {
      msg = "余额不足";
    }
    if (!!msg) {
      Toast.show(msg);
      return;
    }

    const isApprove = GOLDBEAN_APPROVE_AMOUNT - order.totalCost >= 0;

    if (!isApprove) {
      setShowModal(true);
      return;
    }

    try {
      const result = await order.createOrder(
        addressId,
        goodsId,
        goodsAmount,
        totalCost
      );
      if (result) {
        Toast.show({
          icon: "success",
          content: "兑换成功",
        });
        setTimeout(() => {
          history.replace("/order");
          order.setExchangeGoods(null);
        }, 2000);
        return;
      }
    } catch {}
    Toast.show({
      icon: "fail",
      content: "兑换失败",
    });
  }
  async function queryAllowanceAll() {
    const allowance = await chain.queryAllowanceAsync({
      type: "goldBee",
      symbol: "GOLDBEAN",
    });

    setApprove(allowance);
  }

  async function queryGoldBeanBalance() {
    chain.getGoldBeanBalance();
  }

  function renderAddress() {
    if (addressManager.list.length === 0) {
      return (
        <EmptyAddress
          onClick={() => {
            history.push("/addAddress");
          }}
        />
      );
    }
    return (
      <AddressItem
        type="show"
        {...addressManager.choseAddress}
        onClick={() => {
          history.push("/order/chooseAddress");
        }}
      />
    );
  }
  function renderModal() {
    if (showModal) {
      return (
        <EmpowerModal
          toApprove={toApprove}
          isGOLDApprove={false}
          GOLD="GOLDBEAN"
          closeModal={() => {
            setShowModal(false);
          }}
        />
      );
    }
    return null;
  }
  return (
    <div className={css.orderCreate}>
      {renderAddress()}
      <div className={css.goodsInfo}>
        <div className={css.goodsInfoBox}>
          <div className={css.top}>
            <div className={css.left}>
              <div className={css.imgBox}>
                <img src={goodsInfo.image} alt="" className={css.img} />
              </div>
              <div className={css.name}>
                <div className={css.nameTop}>{goodsInfo.name}</div>
                <div className={css.nameBottom}>库存：{goodsInfo.stock}件</div>
              </div>
            </div>
            <div className={css.right}>
              <div className={css.number}>{goodsInfo.beans}</div>
              <div className={css.unit}>金豆</div>
            </div>
          </div>
          <div className={css.bottom}>
            <div className={css.left}>选择数量</div>
            <div className={css.right}>
              <Button
                className={css.operation}
                onClick={() => {
                  order.minus();
                }}
              >
                <MinusOutline />
              </Button>
              <div className={css.inputBox}>
                <Input
                  className={css.input}
                  value={order.buyAmount}
                  onChange={(v) => {
                    let value = v.replace(/[^\d]/g, "");
                    if (value === "") {
                      value = 0;
                    }
                    order.changeBuyAmount(parseInt(value));
                  }}
                />
              </div>
              <Button
                className={css.operation}
                onClick={() => {
                  order.plus();
                }}
              >
                <AddOutline />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={css.submitBox}>
        <div className={css.submit}>
          <div className={css.left}>
            合计:<span className={css.amount}>{order.totalCost}</span>
            <span className={css.symbol}>金豆</span>
          </div>
          <div
            className={css.right}
            onClick={() => {
              handleExchange();
            }}
          >
            立即兑换
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject(
  "order",
  "addressManager",
  "chain",
  "view"
)(observer(OrderCreate));
