import React, { useEffect, useState } from "react";
import { Button, Popup } from "semantic-ui-react";
import Cookies from "universal-cookie/lib";

export const AcceptCookies = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cookie = new Cookies();
  
  const toggleAccept = () => {
    setIsOpen(!isOpen);
    cookie.set("cookie", "accepted");
  };

  useEffect(() => {
    if (!cookie.get("cookie")) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Popup
      basic
      flowing
      open={isOpen}
      position={"top center"}
      trigger={<span />}
    >
      This site uses cookies &nbsp;&nbsp;
      <Button onClick={toggleAccept} content={"accept"} positive />
    </Popup>
  );
};
