import { makeAutoObservable, runInAction } from "mobx";
import { exChangeGold, requestSignuature } from "@utils/web3utils_future";
import { fetchOrderList, orderConfrim } from "@common/api";
import chain from "./chain";

class Order {
  goodsInfo = null;
  buyAmount = 1;
  list = [];
  hasMore = false;
  page = 0;
  pageSize = 10;
  tabs = [9, 0, 1, 2];
  tabTitle = {
    9: "全部",
    0: "待发货",
    1: "待签收",
    2: "已完成",
  };
  tab = 9;

  constructor() {
    makeAutoObservable(this);
  }

  get totalCost() {
    return this.buyAmount * this.goodsInfo?.beans;
  }

  setExchangeGoods(goods) {
    this.goodsInfo = goods;
  }

  plus() {
    const amount = this.buyAmount + 1;
    this.changeBuyAmount(amount);
  }
  minus() {
    const amount = this.buyAmount - 1;
    this.changeBuyAmount(amount);
  }
  changeBuyAmount(amount) {
    if (amount >= this.goodsInfo?.stock) amount = this.goodsInfo?.stock;
    if (amount <= 0) amount = 0;
    this.buyAmount = amount;
  }

  async createOrder(addressId, goodsId, goodsAmount, amount) {
    // return true;
    const result = await exChangeGold(addressId, goodsId, goodsAmount, amount);
    return result;
  }

  async queryOrderList(
    page = this.page,
    pageSize = this.pageSize,
    tab = this.tab
  ) {
    const list = await fetchOrderList(chain.address, tab, page, pageSize);
    runInAction(() => {
      this.list = page === 1 ? [...list] : [...this.list, ...list];
      this.hasMore = list.length === pageSize;
    });
  }

  async init(tab) {
    this.page = 1;
    this.hasMore = false;
    if (tab) this.tab = tab;
    console.log("init");
    await this.queryOrderList();
  }

  async nextPage() {
    console.log("next");
    this.page = this.page + 1;
    await this.queryOrderList();
  }

  async refresh() {
    await this.init();
  }
  async changeTab(tab) {
    if (this.tab === tab) return;
    this.tab = tab;
    await this.init();
  }

  async confirmOrder(orderSn) {
    const timestamp = +Date.now();
    const user = chain.address;
    const signuature = await requestSignuature({
      user,
      orderSn,
      timestamp,
    });
    const result = await orderConfrim({
      user,
      orderSn,
      timestamp,
      signuature,
    });
    if (result) {
      runInAction(() => {
        this.queryOrderList(1, this.page * this.pageSize);
      });
    }
    return result;
  }
}

export default new Order();
