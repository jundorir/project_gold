import { makeAutoObservable, runInAction } from "mobx";
import {} from "@utils/web3utils_future";
import { fetchEarningsList } from "@common/api";
import chain from "./chain";

class EarningsList {
  list = [];
  hasMore = true;
  page = 0;
  pageSize = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async queryEarningsList(page = this.page, pageSize = this.pageSize) {
    const list = await fetchEarningsList(chain.address, page, pageSize);
    if (list) {
      runInAction(() => {
        this.list = page === 1 ? [...list] : [...this.list, ...list];
        this.hasMore = list.length === pageSize;
      });
    }
  }

  init() {
    this.page = 1;
    this.queryEarningsList();
  }

  async nextPage() {
    this.page = this.page + 1;
    await this.queryEarningsList();
  }

  async refresh() {
    this.page = 1;
    await this.queryEarningsList();
  }
}

export default new EarningsList();
