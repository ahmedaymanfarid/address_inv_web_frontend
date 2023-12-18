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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Grid spacing={3} justifyContent={"center"} container>
        <Grid item>
          <DetailsView
            type={ContactType.LEAD}
            phone={phone}
            setPhone={setPhone}
          />
        </Grid>
        <Grid minWidth={350} item>
          <NotesView type={ContactType.LEAD} phone={phone} />
        </Grid>
        <Grid minWidth={350} item>
          <ActionsView type={ContactType.LEAD} phone={phone} />
        </Grid>
      </Grid>
    </Box>
  );
}
