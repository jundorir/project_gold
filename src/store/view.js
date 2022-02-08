import { makeAutoObservable } from "mobx";
class View {
  collapsed = true;
  title = "";
  constructor() {
    makeAutoObservable(this);
  }

  changeCollapsed(value) {
    if (value) this.collapsed = value;
    else this.collapsed = !this.collapsed;
  }

  showTitle(title) {
    this.title = title;
  }
}

export default new View();
