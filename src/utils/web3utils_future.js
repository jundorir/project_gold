import { digitWei, computeSymbolToWei, computeWeiToSymbol } from "./common";
import loading from "@utils/loading";
import chain from "../store/chain";
import {
  BaseERC20 as BaseERC20Abi,
  MMRERC20 as MMRAbi,
  GoldBee as GoldBeeAbi,
  netDB as netDBAbi,
} from "../abi";
import { Toast } from "antd-mobile";

let web3_Provider = null;
if (typeof window.web3 !== "undefined") {
  web3_Provider = new window.Web3(window.web3.currentProvider);
  window.utils = web3_Provider.utils;
  window.web3_Provider = web3_Provider;
}

export async function getAccounts() {
  return window.ethereum?.request({ method: "eth_accounts" });
}

let Global_Contract = {};
let Contract = {
  GoldBee: "GoldBee",
  BaseERC20: "BaseERC20",
  MMR: "MMR",
  NetDB: "NetDB",
};
let Abi = {
  BaseERC20: BaseERC20Abi,
  GoldBee: GoldBeeAbi,
  MMR: MMRAbi,
  NetDB: netDBAbi,
};

function getNowUserAddress() {
  return chain.address;
}

export function enable() {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum === "undefined") {
      console.log("MetaMask没有安装!");
      return;
    }
    if (typeof window.web3 === "undefined") {
      console.log("看起来你需要一个Dapp浏览器来启动。");
      return;
    }
    if (window.ethereum.enable) {
      window.ethereum
        .enable()
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
      return;
    } else {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
    }
  });
}

function getContract(contractName, contractAddress) {
  if (contractAddress === undefined) {
    Toast.show({
      icon: "fail",
      content: "网络错误",
    });
    return null;
  }
  // console.log("web3_Provider", web3_Provider);
  if (web3_Provider === null) {
    if (typeof window.web3 !== "undefined") {
      web3_Provider = new window.Web3(window.web3.currentProvider);
      window.utils = web3_Provider.utils;
      window.web3_Provider = web3_Provider;
    }
  }
  if (web3_Provider === null) return null;
  if (
    [
      Contract.GoldBee,
      Contract.MMR,
      Contract.BaseERC20,
      Contract.NetDB,
    ].includes(contractName)
  ) {
    if (!Global_Contract[contractName + contractAddress])
      Global_Contract[contractName + contractAddress] =
        new web3_Provider.eth.Contract(Abi[contractName], contractAddress);
    return Global_Contract[contractName + contractAddress];
  }
  return null;
}

function sendAsync(params, needLog = false) {
  //   loading.show();
  return new Promise((resolve, reject) => {
    window.ethereum.sendAsync(
      {
        method: "eth_sendTransaction",
        params: params,
        from: getNowUserAddress(),
      },
      function (err, result) {
        console.log("err: ", err, "result:", result);
        // return;
        loading.show();
        if (!!err) {
          reject(err);
          loading.hidden();
          return;
        }
        let a = null;
        if (result.error) {
          reject(result.error.message);
          if (!!a) clearInterval(a);
          loading.hidden();
          return;
        }
        if (result.result) {
          a = setInterval(() => {
            web3_Provider.eth
              .getTransactionReceipt(result.result)
              .then((res) => {
                // console.log("getTransactionReceipt ==>", res);
                if (res) {
                  loading.hidden();
                  clearInterval(a);
                  if (!needLog) {
                    resolve(res.status); // res.status true or false;
                  } else {
                    resolve({
                      status: res.status,
                      logs: res.logs,
                    }); // res.status true or false;
                  }
                } else {
                }
              });
          }, 200);
        }
      }
    );
  });
}

/**
 * 获取绑定的父节点
 * @returns
 */
export async function getParent(query = null) {
  const contract = getContract(
    Contract.NetDB,
    chain.contractAddress?.goldNetDB
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.getParent(query ? query : getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("getParent ===> ", result);
          resolve(result);
        }
      });
  });
}

/**
 * 绑定的父节点
 * @returns
 */
export async function bindParentAsync(parentAddress) {
  const contract = getContract(
    Contract.NetDB,
    chain.contractAddress?.goldNetDB
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.goldNetDB,
      value: "0x0",
      data: contract?.methods
        ?.bindParent(getNowUserAddress(), parentAddress)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 代币交易授权
 * @returns
 */
export function approve(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  let params = [
    {
      from: getNowUserAddress(),
      to: TokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.approve(
          contractAddress,
          web3_Provider.utils.toHex(
            web3_Provider.utils.toBN("1000000000000000000000000000000000")
          )
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, true);
}

window.approveTest = approveTest;
export function approveTest(symbol, type) {
  const map = {
    goldBee: chain.contractAddress?.goldBee,
  };
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contractAddress = map[type];
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  console.log("TokenAddress", TokenAddress);
  console.log("contractAddress", contractAddress);
  let params = [
    {
      from: getNowUserAddress(),
      to: TokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.approve(
          contractAddress,
          web3_Provider.utils.toHex(
            web3_Provider.utils.toBN("1000000000000000000000000000000000")
          )
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, true);
}

/**
 * 是否允许调用钱包地址
 * @returns
 */
export function allowance(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        // console.log("allowance result ====> ", result);
        if (result < 10000000000000000000000000000000) {
          resolve(false);
        } else {
          resolve(result);
        }
      });
  });
}

window.queryAllowance = queryAllowance;
export async function queryAllowance({ type, symbol }) {
  const map = {
    goldBee: chain.contractAddress?.goldBee,
  };
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contractAddress = map[type];
  const contract = getContract(Contract.BaseERC20, TokenAddress);

  const result = await new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        resolve(result);
      });
  });
  return result / Math.pow(10, 18);
}

/**
 * 授权合约允许代币交易流程
 * @param {*} type 1代表MediaAddress,2代表MarketAddress
 * @param {*} TokenAddress 默认为U地址,后续增加更多地址
 * @returns
 */
window.isApproveFlow = isApproveFlow;
export async function isApproveFlow({ type, symbol }) {
  const map = {
    goldBee: chain.contractAddress?.goldBee,
  };

  try {
    let isAllowance = await allowance(
      chain.contractAddress.currencyMap?.[symbol],
      map[type]
    );
    if (isAllowance) {
      return {
        status: true,
        approveAmount: isAllowance / Math.pow(10, 18),
      };
    }

    let { status, logs } = await approve(
      chain.contractAddress.currencyMap?.[symbol],
      map[type]
    );
    if (status) {
      return {
        status: status,
        approveAmount: logs[0].data / Math.pow(10, 18),
      };
    }
  } catch (e) {
    return {
      status: false,
      approveAmount: 0,
    };
  }
}

/**
 * 根据代币地址获取
 * @param {*} TokenAddress
 */
export async function getBalanceAsync(symbol) {
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

//获取当前区块号
export async function getCurrentBlock() {
  const blockNumber = await web3_Provider.eth.getBlockNumber();
  return blockNumber;
}
//获取当前区块时间
export async function getBlockgTime() {
  const blockNumber = await web3_Provider.eth.getBlockNumber();
  const blockTime = await web3_Provider.eth.getBlock(blockNumber);
  return blockTime.timestamp;
}

window.getBalanceAsync = getBalanceAsync;
/**
 * 获取当前轮数
 * @param {*} TokenAddress
 */
export async function getCurrentEpochIdAsync() {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods?._currentEpochId().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}
/**
 * 获取当前期数
 * @param {*} TokenAddress
 */
export async function getCurrentSlotIdAsync() {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods?._currentSlotId().call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}
/**
 * 获取首页数据
 * @param {*} TokenAddress
 */
export async function getViewSlotAsync(epochid, slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods?.viewSlot(epochid, slotid).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        // console.log("result__________>",result);
        const { _Limit, _LeftAmountForGroup, _EndTime, _max, _min } = result;
        resolve({
          _Limit: computeWeiToSymbol(_Limit, 4),
          _LeftLimit: computeWeiToSymbol(_LeftAmountForGroup, 4),
          _EndTime,
          _max: computeWeiToSymbol(_max, 4),
          _min: computeWeiToSymbol(_min, 4),
          // _BeenUse: computeWeiToSymbol(_BeenUse, 4),
        });
      }
    });
  });
}
/**
 * 首页_领取收益
 * @param {*} TokenAddress
 */
export async function getReward({
  amount,
  beeAmount,
  id,
  timstamp,
  userAddress,
}) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.goldBee,
      value: "0x0",
      data: contract.methods
        .reward(userAddress, "0x" + amount, "0x" + beeAmount, id, timstamp)
        .encodeABI(),
    },
  ];

  return sendAsync(params);
}
/**
 * 首页_立即认购
 */
export async function toBuyAsync(epochid, slotid, usdtAmount) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  let usdtAmountwei = computeSymbolToWei(usdtAmount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.goldBee,
      value: "0x0",
      data: contract?.methods
        ?.groupPurchase(
          epochid,
          slotid,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(usdtAmountwei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * 预约__立即预约
 */
export async function toSubscribeAsync(epochid, slotid, usdtAmount) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  let usdtAmountwei = computeSymbolToWei(usdtAmount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.goldBee,
      value: "0x0",
      data: contract?.methods
        ?.subscribe(
          getNowUserAddress(),
          epochid,
          slotid,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(usdtAmountwei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * 预约_获取指定期数总量
 * @param {*} TokenAddress
 */
window.totalAsync = totalAsync;
export async function totalAsync(slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._calculateSpecifySlotLimit(slotid)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 预约_已预约指定期数的量
 * @param {*} TokenAddress
 */
window.subscribeTotalAsync = subscribeTotalAsync;
export async function subscribeTotalAsync(epochid, slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._subscribeTotalAmount(epochid, slotid)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 预约_当前期数预约的最小值
 * @param {*} TokenAddress
 */
window.lowAmountAsync = lowAmountAsync;
export async function lowAmountAsync(slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._calculateSubscribeLowAmount(slotid)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 预约_当前期数预约的最大值
 * @param {*} TokenAddress
 */
window.topAmountAsync = topAmountAsync;
export async function topAmountAsync(slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._calculateSubscribeTopAmount(slotid)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(computeWeiToSymbol(result, 4));
        }
      });
  });
}
/**
 * 预约_查询是否预约过
 * @param {*} TokenAddress
 */
export async function isSubscribe(epochid, slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._isSubscribe(getNowUserAddress(), epochid, slotid)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result > 0);
        }
      });
  });
}
/**
 * 认购_查询是否认购过
 * @param {*} TokenAddress
 */
export async function isBuy(epochid, slotid) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.viewUserInfoOnSlot(getNowUserAddress(), epochid, slotid)
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          resolve(result > 0);
        }
      });
  });
}
/**
 * 预约_预约数据列表
 * @param {*} TokenAddress
 */
export async function getSubscribeData() {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  return new Promise((resolve) => {
    contract?.methods
      ?._subscribeData(getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          // console.log("result------>",result);
          const getResult = result.map((item) => {
            return {
              LowLimit: computeWeiToSymbol(item.LowLimit, 4),
              hasSubScribedAmount: computeWeiToSymbol(
                item.hasSubScribedAmount,
                4
              ),
              isSubscribe: item.isSubscribe,
              slotid: item.slotid,
              subScribeAmount: computeWeiToSymbol(item.subScribeAmount, 4),
              topLimit: computeWeiToSymbol(item.topLimit, 4),
            };
          });
          resolve(getResult);
        }
      });
  });
}
// _currentEpochId 获取当前最新轮数
// _currentSlotId 获取当前最新期数
// viewSlot 获取最新期数据  ===》 _Limit 本期总量 _EndTime 结束时间 _EpochId 轮数 _LeftLimit 剩余总量
// reward ===> 首页领取
// exChangeGold ===> 兑换金条
// groupPurchase ===> 立即认购
// subscribe ===> 立即预约
// _calculateSpecifySlotLimit ====>预约_获取指定期数总量
// _subscribeTotalAmount ====>已预约指定期数的量
// _calculateSubscribeLowAmount ====>预约的最小值   参数为期数
// _calculateSubscribeTopAmount ====>预约的最大值   参数为期数
// _isSubscribe ====>是否预约过   返回结果大于0表明预约过
// _subscribeData ====>获取首页预约信息
// viewUserInfoOnSlot ====>获取当前用户是否认购过
// leftGroupAmount ===> 虚拟剩余

// 用户签名
export async function requestSignuature(signData) {
  let signString = signData;
  if (typeof signData === "object") {
    const sortedKey = Object.keys(signData).sort();
    signString = sortedKey.map((key) => signData[key]).join("_");
  }
  return web3_Provider.eth.personal.sign(signString, getNowUserAddress());
}

export async function exChangeGold(addressId, goodsId, goodsAmount, amount) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.goldBee,
      value: "0x0",
      data: contract?.methods
        ?.exChangeGold(
          addressId,
          goodsId,
          goodsAmount,
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
window.exChangeGold = exChangeGold;

export async function exchangeUSDT(amount) {
  const contract = getContract(
    Contract.GoldBee,
    chain.contractAddress?.goldBee
  );
  const wei = computeSymbolToWei(amount);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.goldBee,
      value: "0x0",
      data: contract?.methods
        ?.exchangeUSDT(
          getNowUserAddress(),
          web3_Provider.utils.toHex(web3_Provider.utils.toBN(wei))
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
