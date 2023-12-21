"use client";

import { signout } from "@/utils/auth";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FC, ReactElement } from "react";

interface LogOutItemProps {
  icon: FC;
  text: string;
}

const LogOutItem: FC<LogOutItemProps> = ({
  icon: Icon,
  text,
}): ReactElement => (
  <ListItem disablePadding onClick={signout}>
    <ListItemButton>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  </ListItem>
);

export default LogOutItem;
