import React from 'react'
import css from './index.module.less'
import loading from '@assets/images/icon/loading.png'

function Loading() {
  return (
    <div className={css.gainWindow}>
      <div className={css.gainBox}>
        {/* nopledge图 */}
        <div className={css.logImg}>
          <img src={loading} alt="" className={css.img} />
        </div>
        {/* 标题 */}
        <div className={css.title}>正在查询结果，请稍后…</div>
      </div>
    </div>
  )
}

export default Loading
