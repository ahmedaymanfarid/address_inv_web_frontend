"use client";

import ActionsView from "@/components/ActionsView";
import DetailsView from "@/components/DetailsView";
import NotesView from "@/components/NotesView";
import { ContactType } from "@/interfaces/enums";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function ViewLead() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = React.useState<string>(
    searchParams.get("phone") as string
  );
  const [assignedTo, setAssignedTo] = React.useState<number>(
    parseInt(searchParams.get("assignedTo") as string)
  );
  const [type, setType] = React.useState<ContactType>(
    searchParams.get("type") as ContactType
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Grid spacing={3} justifyContent={"center"} container>
        <Grid width={370} item>
          <DetailsView
            type={type}
            phone={phone}
            setPhone={setPhone}
            assignedTo={assignedTo}
            setAssignedTo={setAssignedTo}
          />
        </Grid>
        <Grid minWidth={350} item>
          <NotesView type={type} phone={phone} assignedTo={assignedTo} />
        </Grid>
        <Grid minWidth={350} item>
          <ActionsView type={type} phone={phone} assignedTo={assignedTo} />
        </Grid>
      </Grid>
    </Box>
  );
}
