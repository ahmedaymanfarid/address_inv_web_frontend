"use client";
import { components } from "@/interfaces/db_interfaces";
import { AdminOwnerTeamLeader } from "@/interfaces/scopes";
import { getUser } from "@/utils/api";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";
export default function ActionsCard({
  time,
  name,
  phone,
  assignedToName,
}: {
  time: string;
  name?: string;
  phone?: string;
  assignedToName: string;
}) {
  const [user, setUser] = React.useState<components["schemas"]["Employee"]>();

  React.useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchData();
  }, []);

  return (
    <Card raised sx={{ width: 320, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {time}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
            flex: "1",
            width: "100%",
          }}
        >
          {name && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{name}</Typography>
            </Box>
          )}
          {phone && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{phone}</Typography>
            </Box>
          )}
          {AdminOwnerTeamLeader.includes(user?.position.id as number) &&
            assignedToName && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BadgeIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{assignedToName}</Typography>
              </Box>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}
