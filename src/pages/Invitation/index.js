import React from 'react'
import css from './index.module.less'
import QRCode from 'qrcode.react'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import Button from '@components/Button'

function Invitation(props) {
  const { chain } = props
  const inventerUser = chain.address
    ? `?sharer=${chain.address}`
    : `${chain.address}`

  // const address = "https://www.mmr.finance/" + inventerUser;
  const address = `https://${window.location.host}/` + inventerUser

  const copyWord = React.useCallback(() => {
    if (chain.address !== '') {
      // console.log(123);
      var tag = document.createElement('input')
      tag.setAttribute('id', 'cp_input')
      tag.value = address
      document.getElementsByTagName('body')[0].appendChild(tag)
      document.getElementById('cp_input').select()
      document.execCommand('copy')
      document.getElementById('cp_input').remove()
      Toast.show({ icon: 'success', content: '复制成功', duration: 700 })
    } else {
      Toast.show({ icon: 'fail', content: '复制失败', duration: 700 })
    }
  }, [chain.address])

  return (
    <div className={css.invitation}>
      <div className={css.topBox} />
      <div className={css.qrCodeBox}>
        <div className={css.code}>
          <QRCode value={address} className={css.qr} bgColor="transparent" />
        </div>
        <div className={css.scan}>扫一扫即可注册</div>
      </div>
      <div className={css.copyBox}>
        <div className={css.copyBoxInner}>
          <div className={css.tips}>或复制以下链接分享给小伙伴注册</div>
          <div className={css.link}>{address}</div>
          <Button className={css.copy} onClick={copyWord} title="复制链接" />
        </div>
      </div>
    </div>
  )
}

export default inject('chain')(observer(Invitation))
