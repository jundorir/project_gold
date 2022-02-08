import { makeAutoObservable, reaction, runInAction } from "mobx";

import {
  queryUserAddress,
  addUserAddress,
  editUserAddress,
  delUserAddress,
} from "@common/api";
import { requestSignuature } from "@utils/web3utils_future";
import chain from "./chain";
class UserAddress {
  list = [];
  map = new Map();
  choseAddressId = null; // 选中的地址

  constructor() {
    makeAutoObservable(this);
    // reaction(
    //   () => chain.address,
    //   (current) => {
    //     if (!!current) {
    //       this.queryAddress();
    //     }
    //   }
    // );
  }

  get defaultAddress() {
    return this.list.find((item) => item.isDefault === "1");
  }

  get choseAddress() {
    return (
      (this.choseAddressId &&
        this.list.find((item) => item.id === this.choseAddressId)) ||
      this.defaultAddress
    );
  }

  setChoosedAddressId(addressId) {
    this.choseAddressId = addressId;
  }

  getAddressInfo(id) {
    id = parseInt(id);
    return this.map.get(id);
  }

  async queryAddress() {
    let result = await queryUserAddress(chain.address);
    for (let i = 0; i < result.length; i++) {
      if (result[i].isDefault === "1") {
        const cunrrent = result[i];
        result.splice(i, 1);
        result.unshift(cunrrent);
        break;
      }
    }
    runInAction(() => {
      this.list = result;
      const newMap = new Map();
      result.forEach((element) => {
        newMap.set(element.id, element);
      });
      this.map = newMap;
    });
  }

  async addAddress({
    area,
    address,
    name,
    mobile,
    lable,
    isDefault,
    // timestamp,
    // signuature,
  }) {
    const timestamp = +Date.now();
    const user = chain.address;
    const signuature = await requestSignuature({
      user,
      area,
      address,
      name,
      mobile,
      lable,
      isDefault,
      timestamp,
      // signuature,
    });
    const result = await addUserAddress({
      user,
      area,
      address,
      name,
      mobile,
      lable,
      isDefault,
      timestamp,
      signuature,
    });
    return result;
  }
  async delAddress(id) {
    const timestamp = +Date.now();
    const user = chain.address;
    const signuature = await requestSignuature({
      user,
      timestamp,
      id,
    });
    const result = await delUserAddress({
      user,
      id,
      timestamp,
      signuature,
    });
    return result;
  }
  async editAddress({ id, area, address, name, mobile, lable, isDefault }) {
    const timestamp = +Date.now();
    const user = chain.address;
    const signuature = await requestSignuature({
      user,
      area,
      address,
      name,
      mobile,
      lable,
      isDefault,
      timestamp,
      id,
      // signuature,
    });
    const result = await editUserAddress({
      user,
      area,
      address,
      name,
      mobile,
      lable,
      isDefault,
      timestamp,
      signuature,
      id,
    });
    return result;
  }
}

export default new UserAddress();
