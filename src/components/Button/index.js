import classNames from "classnames";
import css from "./index.module.less";
function Button(props) {
  const { title, onClick, disabled, className } = props;
  return (
    <div
      className={classNames(css.button, className, disabled && css.disabled)}
      onClick={(e) => {
        e.stopPropagation();
        if (typeof onClick === "function" && !disabled) {
          onClick();
        }
      }}
    >
      {title}
    </div>
  );
}

export default Button;
