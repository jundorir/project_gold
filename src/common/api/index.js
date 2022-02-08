import ajax from "@common/ajax";

const API = {
  getContractAddress: "/index/getContractAddress",
  getNotice: "/index/messageList",
  getCommunity: "/index/getInviter",

  fetchUserAddress: "/index/addressList",
  addUserAddress: "/index/addAddress",
  editUserAddress: "/index/editAddress",
  delUserAddress: "/index/delAddress",
  fetchGoodsList: "/index/goodsList",
  getReceive: "/index/receiveGoldClub",
  getOrderList: "/index/orderList",
  orderConfrim: "/index/orderConfrim",
  gainUSDT: "/index/receiveAward",
  getHomepageData: "/index/getUserInfo",
  getEarningsList: "/index/incomeList",
  getAttendList: "/index/subscribList",
  getSubscribeList: "/index/beforehandList",
  getCommunityList: "/index/teamList",
};

export async function fetchContractAddress(env = 1) {
  const api = API.getContractAddress;
  return ajax.get(api, { params: { env } }).then((res) => {
    return res.data;
  });
}

export async function fetchNotice(page = 1, pagesize = 1000) {
  const api = API.getNotice;
  return ajax.get(api, { params: { page, pagesize } }).then((res) => {
    return res.data;
  });
}

export async function fetchCommunity(address, page = 1) {
  const api = API.getCommunity;
  return ajax.get(api, { params: { user: address, page } }).then((res) => {
    return res.data;
  });
}

export async function queryUserAddress(address) {
  const api = API.fetchUserAddress;
  return ajax.get(api, { params: { user: address } }).then((res) => res.data);
}
export async function addUserAddress(info) {
  const api = API.addUserAddress;
  return ajax.get(api, { params: { ...info } }).then((res) => res.code === 1);
}
export async function editUserAddress(info) {
  const api = API.editUserAddress;
  return ajax.get(api, { params: { ...info } }).then((res) => res.code === 1);
}
export async function delUserAddress(info) {
  const api = API.delUserAddress;
  return ajax.get(api, { params: { ...info } }).then((res) => res.code === 1);
}

export async function orderConfrim(info) {
  const api = API.orderConfrim;
  return ajax.get(api, { params: { ...info } }).then((res) => res.code === 1);
}

export async function fetchGoodsList() {
  const api = API.fetchGoodsList;
  return ajax.get(api).then((res) => res.data);
}
export async function fetchOrderList(address, status, page = 1, pagesize = 10) {
  const api = API.getOrderList;
  return ajax
    .get(api, { params: { user: address, page, pagesize, status } })
    .then((res) => {
      return res.data;
    });
}

export async function fetchGet(address) {
  const api = API.getReceive;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    console.log("res", res);
    return res.data;
  });
}

export async function fetchPledgeList(
  address,
  page = 1,
  pagesize = 10,
  type = 1
) {
  const api = API.getPledgeList;
  return ajax
    .get(api, { params: { user: address, page, pagesize, type } })
    .then((res) => {
      return res.data;
    });
}
// 首页领取
export async function fetchGain(address) {
  const api = API.gainUSDT;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
// 首页数据
export async function fetchHomepageData(address) {
  const api = API.getHomepageData;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
// 收益记录
export async function fetchEarningsList(address, page = 1, pagesize = 10) {
  const api = API.getEarningsList;
  return ajax
    .get(api, { params: { user: address, page, pagesize } })
    .then((res) => {
      return res.data;
    });
}
// 参与记录
export async function fetchAttendList(address, page = 1, pagesize = 10) {
  const api = API.getAttendList;
  return ajax
    .get(api, { params: { user: address, page, pagesize } })
    .then((res) => {
      return res.data;
    });
}
// 我的预约
export async function fetchSubscribeList(address, page = 1, pagesize = 10) {
  const api = API.getSubscribeList;
  return ajax
    .get(api, { params: { user: address, page, pagesize } })
    .then((res) => {
      return res.data;
    });
}
// 我的社区
export async function fetchCommunityList(address, page = 1, pagesize = 10) {
  const api = API.getCommunityList;
  return ajax
    .get(api, { params: { user: address, page, pagesize } })
    .then((res) => {
      return res.data;
    });
}
