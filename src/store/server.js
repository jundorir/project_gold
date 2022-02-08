import { makeAutoObservable, runInAction } from "mobx";
import { computeWeiToSymbol, interception } from "@utils/common";
import { fetchNotice, fetchHomepageData } from "@common/api";
class Server {
  noticeList = [];
  noticeReadList = [];
  agreement = "";
  home_usdt = 0; //待领取USDT
  home_beans = 0; //待领取金豆
  home_beans_already = 0; //已领取金豆
  home_usdt_static = 0; //静态收益（USDT）
  home_usdt_dynamic = 0; //动态收益（USDT）
  home_principal = 0; //本金
  level = 0;

  constructor() {
    makeAutoObservable(this);
    this.requestServerData();
  }
  async requestServerData() {
    this.queryNotice()
  }

  async queryNotice() {
    const list = await fetchNotice();
    let noticeReadList = localStorage.getItem("readNotice");
    if (noticeReadList === null || noticeReadList === "") {
      noticeReadList = [];
    } else {
      noticeReadList = noticeReadList?.split(",") || [];
    }
    runInAction(() => {
      this.noticeList = list;
      this.noticeReadList = noticeReadList;
    });
  }

  getNoticeById(id) {
    const notice = this.noticeList.filter(
      (item) => item.id.toString() === id.toString()
    );
    return notice[0];
  }

  read(id) {
    let newReadList = [...this.noticeReadList, id.toString()];
    let sampleList = [...new Set(newReadList)];
    if (sampleList.length > this.noticeReadList.length) {
      this.noticeReadList = sampleList;
      localStorage.setItem("readNotice", sampleList.join(","));
    }
  }
  //获取首页数据
  async homepageData(addresses) {
    try {
      const result = await fetchHomepageData(addresses);
      // console.log("首页数据返回", result);
      runInAction(() => {
        this.home_usdt = result.usdt; //待领取USDT
        this.home_beans = result.beans; //待领取金豆
        this.home_beans_already = result.beans_already; //已领取金豆
        this.home_usdt = result.usdt; //待领取USDT
        this.home_usdt_static = result.usdt_static; //静态收益（USDT）
        this.home_usdt_dynamic = result.usdt_dynamic; //动态收益（USDT）
        this.home_principal = result.principal; //本金
        this.level = result.level; //用户级别
      });
    } catch (error) {
      // console.log(error);
    }
  }
}

export default new Server();
