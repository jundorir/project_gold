import { makeAutoObservable, runInAction } from "mobx";
import {} from "@utils/web3utils_future";
import { fetchCommunityList } from "@common/api";
import chain from "./chain";

class CommunityList {
  list = [];
  hasMore = true;
  page = 0;
  pageSize = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async queryCommunityList(page = this.page, pageSize = this.pageSize) {
    const list = await fetchCommunityList(chain.address, page, pageSize);
    if (list) {
      runInAction(() => {
        this.list = page === 1 ? [...list] : [...this.list, ...list];
        this.hasMore = list.length === pageSize;
      });
    }
  }

  init() {
    this.page = 1;
    this.queryCommunityList();
  }

  async nextPage() {
    this.page = this.page + 1;
    await this.queryCommunityList();
  }

  async refresh() {
    this.page = 1;
    await this.queryCommunityList();
  }
}

export default new CommunityList();
