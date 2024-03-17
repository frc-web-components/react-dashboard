import editIcon from "/edit.svg";
import checkIcon from "/check.svg";
import { selectEditing, toggleEditing } from "../store/slices/appSlice";
import { useAppDispatch, useAppSelector } from "../store/app/hooks";

function SettingsButton() {
  const dispatch = useAppDispatch();
  const editing = useAppSelector(selectEditing);

  return (
    <img
      style={{
        transform: "rotate(90deg)",
        margin: "0 5px",
        cursor: "pointer",
      }}
      src={editing ? checkIcon : editIcon}
      onClick={() => {
        dispatch(toggleEditing());
      }}
    />
  );
}

export default SettingsButton;
