import { render } from "@testing-library/react";
import Friend from "./Friend";
import { Provider } from "react-redux";
import store from "../../store/index";

test("<Friend/> renders correctly", () => {
  const friend = "visitor1";
  const onClickFriend = () => {};
  const checked = false;
  const changeCheck = () => {};
  const isFriend = true;
  const addFriend = () => {};

  const component = render(
    <Provider store={store}>
      <Friend
        friend={friend}
        onClickFriend={onClickFriend}
        checked={checked}
        changeCheck={changeCheck}
        isFriend={isFriend}
        addFriend={addFriend}
      />
    </Provider>
  );
  expect(component).toBeTruthy();
});
