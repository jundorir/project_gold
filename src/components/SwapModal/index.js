import React from "react";
import css from "./index.module.less";
import { CloseOutline } from "antd-mobile-icons";
import Button from "@components/Button";
import { Input, Toast } from "antd-mobile";
import { inject, observer } from "mobx-react";
import {
  computeSymbolToWei,
  computeWeiToSymbol,
  checkFloatNumber,
} from "@utils/common";
import EmpowerModal from "@components/EmpowerModal";

function SwapModal(props) {
  const [amount, setAmount] = React.useState(0);
  const { chain } = props;
  const [GOLDBEAN_APPROVE_AMOUNT, setApprove] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (chain.address) {
      chain.getGoldBeanBalance();
      queryAllowanceAll();
    }
  }, [chain.address]);

  const closeWindow = React.useCallback(() => {
    props.closeModal();
  }, [props]);

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

  async function handleSwap() {
    const isApprove = GOLDBEAN_APPROVE_AMOUNT - amount >= 0;
    if (!isApprove) {
      setShowModal(true);
      return;
    }

    try {
      const result = await chain.toExchangeUSDT(amount);
      if (result) {
        chain.getGoldBeanBalance();
        Toast.show({
          icon: "success",
          content: "兑换成功",
        });
        setTimeout(() => {
          closeWindow();
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
    <div className={css.mask}>
      <div className={css.modal}>
        <div>
          <CloseOutline
            className={css.close}
            onClick={() => {
              closeWindow();
            }}
          />
        </div>
        <div
          className={css.modalBox}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={css.title}>兑换</div>
          <div className={css.line}>
            <div className={css.left}>From:</div>
            <div className={css.right}>
              金豆<div className={css.beanIcon}></div>
            </div>
          </div>
          <div className={css.beanBox}>
            <div className={css.top}>
              <div className={css.left}>
                <Input
                  className={css.input}
                  value={amount}
                  onChange={(v) => {
                    if (v === "") {
                      setAmount("");
                    } else {
                      if (checkFloatNumber(v)) {
                        if (v - chain.goldBeanBalance > 0) {
                          v = chain.goldBeanBalance;
                        }

                        if (v.length > 1 && v.startsWith("0")) {
                          v = v.replace(/^[0]+/, "");
                          if (v === "") v = "0";
                          if (v.startsWith(".")) v = "0" + v;
                        }
                        setAmount(v);
                      }
                    }
                  }}
                />
              </div>
              <div
                className={css.right}
                onClick={() => {
                  setAmount(chain.goldBeanBalance);
                }}
              >
                MAX
              </div>
            </div>

            <div className={css.bottom}>
              <div className={css.left}>金豆余额:</div>
              <div className={css.right}>{chain.goldBeanBalance}</div>
            </div>
          </div>
          <div className={css.arrowBox}>
            <div className={css.arrow} />
          </div>
          <div className={css.line}>
            <div className={css.left}>To:</div>
            <div className={css.right}>
              USDT<div className={css.usdtIcon}></div>
            </div>
          </div>
          <div className={css.usdtBox}>
            <div className={css.amount}>
              {computeWeiToSymbol(computeSymbolToWei(amount / 8), 4)}
            </div>
          </div>

          <div className={css.tips}>
            汇率：<span>6</span> 金豆= <span>1</span> USDT
          </div>
          <div className={css.tips}>
            说明：兑换会销毁 <span>25%</span>
          </div>

          <Button title="兑换" className={css.swap} onClick={handleSwap} />
        </div>
      </div>
      {renderModal()}
    </div>
  );
}

export default inject("chain")(observer(SwapModal));
