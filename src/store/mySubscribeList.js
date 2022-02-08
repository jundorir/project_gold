import { makeAutoObservable, runInAction } from "mobx";
import {} from "@utils/web3utils_future";
import { fetchSubscribeList } from "@common/api";
import chain from "./chain";

class MySubscribeList {
  list_mySubscribe = [];
  hasMore_mySubscribe = true;
  page = 0;
  pageSize = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async queryMySubscribeList(page = this.page, pageSize = this.pageSize) {
    const list_mySubscribe = await fetchSubscribeList(
      chain.address,
      page,
      pageSize
    );
    if (list_mySubscribe) {
      runInAction(() => {
        this.list_mySubscribe =
          page === 1
            ? [...list_mySubscribe]
            : [...this.list_mySubscribe, ...list_mySubscribe];
        this.hasMore_mySubscribe = list_mySubscribe.length === pageSize;
      });
    }
  }

  init() {
    this.page = 1;
    this.queryMySubscribeList();
  }

  async nextPage() {
    this.page = this.page + 1;
    await this.queryMySubscribeList();
  }

  async refresh() {
    this.page = 1;
    await this.queryMySubscribeList();
  }
}

export default new MySubscribeList();
