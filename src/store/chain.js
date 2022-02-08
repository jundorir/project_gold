import { makeAutoObservable, runInAction, reaction } from "mobx";
import {
  getAccounts,
  getParent,
  bindParentAsync,
  isApproveFlow,
  enable,
  queryAllowance,
  getCurrentBlock,
  getCurrentEpochIdAsync,
  getCurrentSlotIdAsync,
  getViewSlotAsync,
  getBalanceAsync,
  toBuyAsync,
  toSubscribeAsync,
  totalAsync,
  subscribeTotalAsync,
  lowAmountAsync,
  topAmountAsync,
  isSubscribe,
  getSubscribeData,
  exchangeUSDT,
  isBuy,
} from "@utils/web3utils_future";
import { quiteAddress, computeWeiToSymbol } from "@utils/common";
import loading from "@utils/loading";
import { fetchContractAddress, fetchHomepageData } from "@common/api";
import { Toast } from "antd-mobile";
// const curChainId = "0x1b2e5"; //测试环境
const curChainId = "0x80"; //正式环境

class Chain {
  address = "";
  chainId = curChainId;
  initEnd = false;
  currentBlockNumber = 0; //当前区块号
  MMRBalance = 0;
  bindParnet = null;
  balance = 0;
  sharer = "";
  contractAddress = {};
  currentEpochId = 0; //当前轮数
  currentSlotId = 0; //当前期数
  _EndTime = 0; // 结束时间
  _Limit = 0; // 本期总量
  _LeftLimit = 0; // 本期剩余
  _max = 0; // 最大购买
  _min = 0; // 最小购买
  isBuy = false; //是否认购过当前期
  USDTBalance = 0; //USDT余额
  // _BeenUse = 0; //本次需要消耗的金豆
  goldBeanBalance = 0; //金豆余额
  subscribeList = []; //预约列表
  currentTotal = 0; // 当前总预约
  currentSubscribeTotal = 0; //当前已预约
  currentSubscribeLeft = 0; //当前预约剩余
  currentLowAmount = 0; //当前最小预约金额
  currentTopAmount = 0; //当前最大预约金额
  currentIsSubscribe = false; //当前是否已预约

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.chainId,
      (current) => {
        if (current === undefined || current === null) {
          this.chainId = window.ethereum?.chainId;
        } else if (parseInt(current) !== parseInt(curChainId)) {
          loading.showNetWorkError();
        } else {
          loading.hidden();
        }
      }
    );
    reaction(
      () => this.address,
      (address) => {
        if (address !== "") {
          this.queryBindParent();
        }
      }
    );

    this.init();
  }

  get isLogin() {
    return !!this.address;
  }

  get isCorrectChain() {
    return this.chainId === curChainId;
  }

  async queryContractAddress() {
    const list = await fetchContractAddress();

    runInAction(() => {
      let contractTempAddress = {};
      list.forEach((element) => {
        contractTempAddress[element.name] = element.address;
      });

      let currencyMap = {
        GOLDBEAN: contractTempAddress.beanAddress,
        USDT: contractTempAddress.usdtAddress,
      };

      this.contractAddress = {
        ...contractTempAddress,
        currencyMap: currencyMap,
      };
      console.log("this.contractAddress", this.contractAddress);
    });
  }

  get isActive() {
    return (
      this.bindParnet !== null &&
      this.bindParnet !== "0x0000000000000000000000000000000000000000"
    );
  }

  setAddress(address) {
    this.address = address;
    if (address !== "") {
      localStorage.setItem("address", address);
      return;
    }
    localStorage.removeItem("address");
  }

  get quiteAddress() {
    if (!this.address) return "";
    return {
      quiteAddress: quiteAddress(this.address),
      headerAddress: quiteAddress(this.address, { left: 4, right: 4 }),
    };
  }

  async init() {
    this.registerListener();
    this.chainId = window.ethereum?.chainId;
    console.log("this.chainId", this.chainId);
    console.log("this.cchainId", curChainId);

    try {
      await this.queryContractAddress();
    } catch {
      Toast.show({
        icon: "fail",
        content: "网络连接异常，请刷新页面后重试",
      });
      return;
    }

    const account = await this.getNowAccounts();

    if (account) {
      this.queryBindParent();
      this.getBalance();
      this.getGoldBeanBalance();
      this.getCurrentBlock();
    }

    this.initEnd = true;
  }

  async requestChainData() {
    this.getData();
    this.getBalance();
  }
  async getNowAccounts() {
    const accounts = await getAccounts();
    if (accounts?.length > 0) {
      this.setAddress(accounts[0]);
    }
    return accounts?.[0];
  }

  registerListener() {
    window.ethereum?.on("chainChanged", (newChainId) => {
      // console.log("chainChanged", newChainId);

      runInAction(() => {
        this.chainId = newChainId;
      });
    });

    window.ethereum?.on("accountsChanged", (accounts) => {
      let newAddress = "";
      if (accounts.length > 0) {
        newAddress = accounts[0];
      }
      this.setAddress(newAddress);
    });
    window.ethereum?.on("connect", (connectInfo) => {
      // console.log("connect", connectInfo);
      runInAction(() => {
        this.chainId = connectInfo.chainId;
      });
    });
  }

  login() {
    enable();
  }

  async queryBindParent() {
    let parent = localStorage.getItem(`${this.address}_bind_parent`);
    if (
      parent === null ||
      parent === "false" ||
      parent === "0x0000000000000000000000000000000000000000"
    ) {
      // console.log('111222233334444')
      parent = await getParent();
      if (parent === false) {
        return;
      }
      localStorage.setItem(`${this.address}_bind_parent`, parent);
    }

    runInAction(() => {
      this.bindParnet = parent;
    });
    // console.log("parent ==>", parent);
  }

  async bindParnetFunction(parentAddress) {
    // loading.show();
    // return;
    console.log("父节点地址", parentAddress);
    const bindResult = await bindParentAsync(parentAddress);

    if (bindResult) {
      localStorage.setItem(`${this.address}_bind_parent`, parentAddress);
    }
    return bindResult;
  }
  //查询上级地址是否可绑定
  async queryParnetFunction(query) {
    const queryResult = await getParent(query);
    return queryResult;
  }

  // 获取代币余额
  async getBalance() {
    const getBalanceResult = await getBalanceAsync("USDT");
    runInAction(() => {
      this.USDTBalance = getBalanceResult;
    });
  }

  // 获取金豆余额
  async getGoldBeanBalance() {
    const getBalanceResult = await this.queryBalance("GOLDBEAN");
    runInAction(() => {
      this.goldBeanBalance = getBalanceResult;
    });
  }

  async queryBalance(symbol) {
    const balace = await getBalanceAsync(symbol);
    return balace;
  }

  async queryAllowanceAsync(symbol) {
    const allowance = await queryAllowance(symbol);
    return allowance;
  }
  async toApprove({ type, symbol }) {
    const balace = await isApproveFlow({ type, symbol });
    return balace;
  }

  async setSharer(sharer) {
    // console.log('sharer', sharer)
    this.sharer = sharer;
  }

  // 获取当前区块号
  async getCurrentBlock() {
    const getCurrentBlockResult = await getCurrentBlock();
    runInAction(() => {
      this.currentBlockNumber = getCurrentBlockResult;
    });
  }
  // 获取最新期数据
  async getData() {
    try {
      const getcurrentEpochIdResult = await getCurrentEpochIdAsync();
      const getCurrentSlotIdResult = await getCurrentSlotIdAsync();
      if (getcurrentEpochIdResult && getCurrentSlotIdResult) {
        const getViewSlotResult = await getViewSlotAsync(
          getcurrentEpochIdResult,
          getCurrentSlotIdResult
        );
        const getIsBuyResult = await isBuy(
          getcurrentEpochIdResult,
          getCurrentSlotIdResult
        );
        console.log("getViewSlotResult------》", getViewSlotResult);
        runInAction(() => {
          this._EndTime = getViewSlotResult._EndTime;
          this._LeftLimit = getViewSlotResult._LeftLimit;
          this._Limit = getViewSlotResult._Limit;
          this._max = getViewSlotResult._max;
          this._min = getViewSlotResult._min;
          this.isBuy = getIsBuyResult;
          // this._BeenUse = getViewSlotResult._BeenUse;
        });
      }
      runInAction(() => {
        this.currentEpochId = getcurrentEpochIdResult;
        this.currentSlotId = getCurrentSlotIdResult;
      });
    } catch (error) {
      console.log(error);
    }
  }
  // 立即认购
  async toPledge(epochid, slotid, usdtAmount) {
    const toBuyResult = await toBuyAsync(epochid, slotid, usdtAmount);
    console.log("购买结果", toBuyResult);
    return toBuyResult;
  }
  // 立即预约
  async toSubscribe(epochid, slotid, usdtAmount) {
    const toSubscribeResult = await toSubscribeAsync(
      epochid,
      slotid,
      usdtAmount
    );
    console.log("购买结果", toSubscribeResult);
    return toSubscribeResult;
  }
  //获取预约列表数据
  // async getSubscribeList(epochid, slotid) {
  //   const totalResult = await totalAsync(slotid);
  //   const subscribeTotalResult = await subscribeTotalAsync(epochid, slotid);
  //   const lowAmountResultc = await lowAmountAsync(slotid);
  //   const topAmountResult = await topAmountAsync(slotid);
  //   const isSubscribeResult = await isSubscribe(epochid, slotid);
  //   if (
  //     totalResult &&
  //     subscribeTotalResult &&
  //     lowAmountResultc &&
  //     topAmountResult
  //   ) {
  //     runInAction(() => {
  //       this.subscribeList.push({
  //         total: totalResult,
  //         subscribeTotal: subscribeTotalResult,
  //         LowAmount: lowAmountResultc,
  //         TopAmount: topAmountResult,
  //         epochid,
  //         slotid,
  //         isSubscribe: isSubscribeResult,
  //       });
  //     });
  //   }
  // }
  //获取某期预约数据
  async getCurrentSubscribe(epochid, slotid) {
    const totalResult = await totalAsync(slotid);
    const subscribeTotalResult = await subscribeTotalAsync(epochid, slotid);
    const lowAmountResultc = await lowAmountAsync(slotid);
    const topAmountResult = await topAmountAsync(slotid);
    const isSubscribeResult = await isSubscribe(epochid, slotid);
    runInAction(() => {
      this.currentTotal = totalResult;
      this.currentSubscribeTotal = subscribeTotalResult;
      this.currentSubscribeLeft = totalResult - subscribeTotalResult;
      this.currentLowAmount = lowAmountResultc;
      this.currentTopAmount = topAmountResult;
      this.currentIsSubscribe = isSubscribeResult;
    });
  }
  // 预约数据列表
  async getSubscribeData() {
    const getSubscribeDataResult = await getSubscribeData();
    // console.log("预约数据列表getSubscribeData", getSubscribeDataResult);
    runInAction(() => {
      this.subscribeList = getSubscribeDataResult;
    });
    return getSubscribeDataResult;
  }
  //初始化数据
  async initialize() {
    this.subscribeList = [];
  }

  async toExchangeUSDT(amount) {
    const result = await exchangeUSDT(amount);
    return result;
  }
}

export default new Chain();
