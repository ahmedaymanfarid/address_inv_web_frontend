"use client";

import { components } from "@/interfaces/db_interfaces";
import { getUser } from "@/utils/api";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { FC, ReactElement } from "react";

interface LogOutItemProps {
  icon: FC;
}

const LogOutItem: FC<LogOutItemProps> = ({ icon: Icon }): ReactElement => {
  const [user, setUser] = React.useState<components["schemas"]["Employee"]>();
  React.useEffect(() => {
    getUser().then((res) => {
      setUser(res);
    });
  }, []);
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={user?.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default LogOutItem;
