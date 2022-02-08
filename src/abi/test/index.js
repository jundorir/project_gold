import { BaseERC20 } from "./BaseERC20";
import { MMRERC20 } from "./MMRERC20";
import { GoldBee } from "./GoldBee";
import { netDB } from "./netDB";

const abi = {
  BaseERC20,
  MMRERC20,
  GoldBee,
  netDB
};
export { BaseERC20, MMRERC20, GoldBee , netDB};
export default abi;
