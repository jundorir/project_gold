import { makeAutoObservable, runInAction } from "mobx";
import { fetchGoodsList } from "@common/api";
import { host } from "@common/const";
class Goods {
  list = [];
  showAll = true;
  constructor() {
    makeAutoObservable(this);
  }

  async queryGoodsList() {
    const result = await fetchGoodsList();
    runInAction(() => {
      const list = result.map((item) => {
        return {
          ...item,
          image: host + item.image,
        };
      });
      this.list = list;
    });
  }

  changeShowAll() {
    this.showAll = !this.showAll;
  }
}

export default new Goods();
