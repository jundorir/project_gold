import classNames from 'classnames'
import { Link } from 'react-router-dom'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'

function MenuItem({
  path,
  label,
  icon,
  activeIcon,
  pathname,
  right,
  server,
  isLast,
  _target,
  _special_path
}) {
  const active = pathname === path
  const showIcon = active ? activeIcon : icon
  right = right || <div className={css.arrow}></div>
  if (_target) {
    if (_special_path) {

      let whitePaperPath = {
        SimplifiedChinese: ''
      }
      return (
        <a
          href={`${path}${whitePaperPath['SimplifiedChinese']}`}
          className={classNames(css.menuItem, isLast && css.last)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => {
            // e.preventDefault();
            e.stopPropagation()
          }}
        >
          <img src={showIcon} alt={label} className={css.image} />
          <span className={css.label}>{label['SimplifiedChinese']}</span>
          <span className={css.right}> {right} </span>
        </a>
      )
    }
    return (
      <a
        href={path}
        className={css.menuItem}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <img src={showIcon} alt={label} className={css.image} />
        <span className={css.label}>{label['SimplifiedChinese']}</span>
        <span className={css.right}> {right} </span>
      </a>
    )
  }

  if (
    (!server.is_transfer &&
      (path === '/mobilityMining' ||
        path === '/mobilityPool' ||
        path === '/forceMining')) ||
    path === '/dao' ||
    path === '/lottery'
  ) {
    return (
      <a
        href={'#'}
        className={css.menuItem}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          const languages = {
            SimplifiedChinese: '即将上线!'
          }
          Toast.show(languages['SimplifiedChinese'])
        }}
      >
        <img src={showIcon} alt={label} className={css.image} />
        <span className={css.label}>{label['SimplifiedChinese']}</span>
        <span className={css.right}> {right} </span>
      </a>
    )
  }

  if (icon) {
    return (
      <Link
        to={path}
        className={classNames(
          css.menuItem,
          active && css.active,
          isLast && css.last
        )}
      >
        <img src={showIcon} alt={label} className={css.image} />
        <span className={css.label}>{label['SimplifiedChinese']}</span>
        <span className={css.right}> {right} </span>
      </Link>
    )
  }
}

export default inject('chain', 'server')(observer(MenuItem))
