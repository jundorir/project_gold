import React from 'react'
import { inject, observer } from 'mobx-react'
import css from './index.module.less'
function Countdown(props) {
  const { deadline, onEnd, current } = props
  const intervalRef = React.useRef(null)
  const [date, setDate] = React.useState({
    hour: '00',
    minutes: '00',
    seconds: '00'
  })

  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    computeDate()
    intervalRef.current = setInterval(() => {
      computeDate()
    }, 1000)
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [deadline])

  function computeDate() {
    const date = Date.now()
    const diffTime = new Date(deadline * 1000).getTime() - date
    if (diffTime <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current)
      onEnd(current)
    }
    let hour = ~~(diffTime / 1000 / 60 / 60)
    let minutes = ~~((diffTime / 1000 / 60) % 60)
    let seconds = ~~((diffTime / 1000) % 60)

    setDate({
      hour: hour.toString(),
      minutes: minutes.toString().padStart(2, 0),
      seconds: seconds.toString().padStart(2, 0)
    })
  }
  return (
    <div className={css.timing}>
      <div className={css.timingL}></div>
      <div className={css.timingR}>
        <div className={css.timingRT}>
          距離
          {current === 1 ? '认购' : '购买'}
          结束还剩：
        </div>
        <div className={css.timingRB}>
          <div className={css.time}>{date.hour}</div>
          <div className={css.tips}>小时</div>
          <div className={css.time}>{date.minutes}</div>
          <div className={css.tips}>分</div>
          <div className={css.time}>{date.seconds}</div>
          <div className={css.tips}>秒</div>
        </div>
      </div>
    </div>
  )
}

export default Countdown
