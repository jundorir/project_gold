import chainStore from "./chain";
import viewStore from "./view";
import serverStore from "./server";
import orderStore from "./order";
import AddressManagerStore from "./addressManager";
import GoodsStore from "./goods";
import earningsListStore from "./earningsList";
import attendListStore from "./attendList";
import mySubscribeListStore from "./mySubscribeList";
import communityListStore from "./communityList";

const Store = {
  chain: chainStore,
  view: viewStore,
  server: serverStore,
  order: orderStore,
  addressManager: AddressManagerStore,
  goods: GoodsStore,
  earningsList: earningsListStore,
  attendList: attendListStore,
  mySubscribeList: mySubscribeListStore,
  communityList: communityListStore,
};

export default Store;
