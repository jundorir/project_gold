import React from "react";
import css from "./index.module.less";
import Button from "@components/Button";
import AddressItem from "../AddressItem";
import { inject, observer } from "mobx-react";
import { useHistory } from "react-router-dom";
function ChooseAddress(props) {
  const { addressManager } = props;
  const history = useHistory();
  const [selectedId, setSelectedId] = React.useState(
    addressManager.choseAddress?.id
  );
  function renderList() {
    return addressManager.list.map((item) => {
      const isSelected = selectedId === item.id;
      return (
        <AddressItem
          key={item.id}
          isSelected={isSelected}
          {...item}
          onClick={() => {
            setSelectedId(item.id);
          }}
        />
      );
    });
  }

  if (addressManager.choseAddress === undefined) {
    history.replace("/mall");
    return null;
  }
  return (
    <div className={css.chooseAddress}>
      <div className={css.list}>{renderList()}</div>
      <Button
        className={css.submit}
        title="确认选择"
        onClick={() => {
          addressManager.setChoosedAddressId(selectedId);
          history.goBack();
        }}
      />
    </div>
  );
}

export default inject("addressManager")(observer(ChooseAddress));
