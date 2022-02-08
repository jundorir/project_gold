import React from 'react'
import css from './index.module.less'
import getsuccess from '@assets/images/icon/getsuccess.png'

function GainWindow(props) {
  const closeWindow = React.useCallback(() => {
    props.closeGainWindow()
  }, [props])
  return (
    <div
      className={css.gainWindow}
      onClick={() => {
        closeWindow()
      }}
    >
      <div
        className={css.gainBox}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className={css.logImg}>
          <img src={getsuccess} alt="" className={css.img} />
          <div className={css.title}>领取成功</div>
        </div>
        <div
          onClick={e => {
            e.stopPropagation()
            closeWindow()
          }}
          className={css.closeImgBox}
        >
          关闭
        </div>
      </div>
    </div>
  )
}

export default GainWindow
