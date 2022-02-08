import React, { memo } from 'react'
import css from './index.module.less'

const NetWorkError = memo(() => {
  return (
    <div className={css.network}>
      <div className={css.box}>
        <div className={css.error} />
        <div className={css.title}>区块链网络错误</div>
        <div className={css.tips}>只能通过heco网络的dapp浏览器访问</div>
        <div className={css.tips}>请检查钱包设置</div>
      </div>
    </div>
  )
})

export default NetWorkError
