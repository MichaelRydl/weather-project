import classes from "./InfoItem.module.css";

const InfoItem = ({ data, infoText, icon }) => {
  return (
    <div className={classes.item}>
      <span className={classes.label}>{infoText}</span>
      <img className={classes.icon} src={icon.src} alt={`${icon.name} icon`} />
      <span className={classes.value}>{`${data[0]}${data[1]}`}</span>
    </div>
  );
};

export default InfoItem;
