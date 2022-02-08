import css from "./index.module.less";
function ViewLogistics() {
  return (
    <div className={css.modal}>
      <div className={css.iframeBox}>
           <iframe src="http://www.kuaidi100.com/" title="100" className={css.iframe}></iframe>
           {/* <iframe src="https://m.kuaidi100.com/result.jsp?nu=23334442" title="100" className={css.iframe}></iframe> */}
       </div>
    </div>
  );
}

export default ViewLogistics;
