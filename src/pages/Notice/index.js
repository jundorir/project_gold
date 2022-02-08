import React from "react";
import css from "./index.module.less";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";

function Notice(props) {
  const history = useHistory();
  const { server } = props;

  React.useEffect(() => {
    server.queryNotice();
  }, []);

  return (
    <div className={css.notice}>
      {server.noticeList.length === 0 && (
        <div className={css.emptyBox}>
          <div className={css.empty} />
          <div className={css.text}>暂无公告</div>
        </div>
      )}
      {server.noticeList.length > 0 &&
        server.noticeList.map((item, index) => {
          return (
            <div
              className={css.item}
              key={item.id}
              onClick={() => {
                server.read(item.id);
                history.push(`/noticeDetail/${item.id}`);
              }}
            >
              <div className={css.left}></div>
              <div className={css.right}>
                <div className={css.titleBox}>
                  <div className={css.title}>
                    {item.title}
                    {!server.noticeReadList.includes(item.id.toString()) && (
                      <span className={css.notRead}></span>
                    )}
                  </div>
                  <div className={css.time}>{item.create_time}</div>
                </div>
                <div className={css.outline}>{item.intro}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default inject("server")(observer(Notice));
