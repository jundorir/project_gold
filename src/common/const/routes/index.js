import Home from "@pages/Home";
import Record from "@pages/Record";
import Community from "@pages/Community";
import Invitation from "@pages/Invitation";
import Notice from "@pages/Notice";
import NoticeDetail from "@pages/Notice/Detail";
import Mall from "@pages/Mall";
import Buy from "@pages/Home/Buy";
import MyAddress from "@pages/Mall/MyAddress";
import AddAddress from "@pages/Mall/AddAddress";
import EditAddress from "@pages/Mall/EditAddress";
import Order from "@pages/Mall/Order";
import ChooseAddress from "@pages/Mall/OrderCreate/ChooseAddress";
import OrderCreate from "@pages/Mall/OrderCreate";
import EarningsRecord from "@pages/Home/EarningsRecord";
import Subscribe from "@pages/Home/Subscribe";
import SubscribeBuy from "@pages/Home/Subscribe/SubscribeBuy";
console.log(process);
const routes = [
  {
    path: "/",
    label: {
      SimplifiedChinese: "首页",
    },
    icon: "home",
    component: <Home />,
  },
  {
    path: "/record",
    label: {
      SimplifiedChinese: "参与记录",
    },
    icon: "record",
    component: <Record />,
  },
  {
    path: "/community",
    label: {
      SimplifiedChinese: "我的社区",
    },
    icon: "community",
    component: <Community />,
  },
  {
    path: "/invitation",
    label: {
      SimplifiedChinese: "分享好友",
    },
    icon: "invitation",
    component: <Invitation />,
  },
  {
    path: "/notice",
    label: {
      SimplifiedChinese: "公告",
    },
    icon: "notice",
    component: <Notice />,
  },
  {
    path: "/mall",
    label: {
      SimplifiedChinese: "金豆商城",
    },
    icon: "mall",
    component: <Mall />,
  },
];

export default routes;

export const SecondaryRoutes = [
  {
    path: "/buy",
    mapPath: "/buy",
    label: {
      SimplifiedChinese: "大金主",
    },
    component: <Buy />,
  },
  {
    path: "/address",
    mapPath: "/address",
    parentPath: "/mall",
    label: {
      SimplifiedChinese: "地址管理",
    },
    component: <MyAddress />,
  },
  {
    path: "/order",
    mapPath: "/order",
    label: {
      SimplifiedChinese: "我的兑换",
    },
    component: <Order />,
  },
  {
    path: "/createOrder",
    mapPath: "/createOrder",
    label: {
      SimplifiedChinese: "确认兑换",
    },
    component: <OrderCreate />,
  },
  {
    path: "/earningsRecord",
    mapPath: "/earningsRecord",
    label: {
      SimplifiedChinese: "收益记录",
    },
    component: <EarningsRecord />,
  },
  {
    path: "/noticeDetail/:id",
    mapPath: "/noticeDetail/",
    label: {
      SimplifiedChinese: "系统消息",
    },
    component: <NoticeDetail />,
  },
  {
    path: "/subscribe",
    mapPath: "/subscribe",
    label: {
      SimplifiedChinese: "预约",
    },
    component: <Subscribe />,
  },
  {
    path: "/subscribe/buy/:epochid&:slotid",
    mapPath: "/subscribe/buy",
    label: {
      SimplifiedChinese: "大金主",
    },
    component: <SubscribeBuy />,
  },

  {
    path: "/editAddress/:id",
    mapPath: "/editAddress/",
    parentPath: "/address",
    label: {
      SimplifiedChinese: "编辑地址",
    },
    component: <EditAddress />,
  },
  {
    path: "/addAddress",
    mapPath: "/addAddress",
    label: {
      SimplifiedChinese: "新增地址",
    },
    component: <AddAddress />,
  },
];

export const ThirdRoutes = [
  {
    path: "/order/chooseAddress",
    mapPath: "/order/chooseAddress",
    parentPath: "/createOrder",
    label: {
      SimplifiedChinese: "选择地址",
    },
    component: <ChooseAddress />,
  },
  // {
  //   path: "/subscribe/buy/:id",
  //   mapPath: "/subscribe/buy",
  //   label: {
  //     SimplifiedChinese: "GOLD CLUB",
  //   },
  //   component: <SubscribeBuy />,
  // },
];

const FirstRoutesMap = new Map();
const SecondaryRoutesMap = new Map();
const ThirdRoutesMap = new Map();

routes.forEach((element) => {
  FirstRoutesMap.set(element.path, element);
});
SecondaryRoutes.forEach((element) => {
  SecondaryRoutesMap.set(element.mapPath, element);
});
ThirdRoutes.forEach((element) => {
  ThirdRoutesMap.set(element.mapPath, element.label);
});
export { FirstRoutesMap, SecondaryRoutesMap, ThirdRoutesMap };
