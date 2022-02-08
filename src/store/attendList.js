import { makeAutoObservable, runInAction } from "mobx";
import {} from "@utils/web3utils_future";
import { fetchAttendList } from "@common/api";
import chain from "./chain";

class AttendList {
  list_attend = [];
  hasMore_attend = true;
  page = 0;
  pageSize = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async queryAttendList(page = this.page, pageSize = this.pageSize) {
    const list_attend = await fetchAttendList(chain.address, page, pageSize);
    // console.log("list_attend------>", list_attend);
    if (list_attend) {
      runInAction(() => {
        this.list_attend =
          page === 1 ? [...list_attend] : [...this.list_attend, ...list_attend];
        this.hasMore_attend = list_attend.length === pageSize;
      });
    }
  }

  init() {
    this.page = 1;
    this.queryAttendList();
  }

  async nextPage() {
    this.page = this.page + 1;
    await this.queryAttendList();
  }

  async refresh() {
    this.page = 1;
    await this.queryAttendList();
  }
}

export default new AttendList();
