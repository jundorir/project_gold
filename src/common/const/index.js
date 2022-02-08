const env = "test"; //production test;

const hostConfig = {
  // test: "https://wjq008.139coins.com",    //测试环境
  // product: "https://wjq008.139coins.com",
  test: "https://api.goldclub.finance", //正式环境
  product: "https://api.goldclub.finance",
};

export const host = hostConfig[env];
