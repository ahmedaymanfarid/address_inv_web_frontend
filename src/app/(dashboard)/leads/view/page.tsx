"use client";

import { components } from "@/interfaces/db_interfaces";
import { HttpMethod, getData } from "@/utils/api";
import PhoneIcon from "@mui/icons-material/Phone";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import debounce from "lodash.debounce";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function ViewLead() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = React.useState<string>("");

  const [lead, setLead] = React.useState<components["schemas"]["Lead"]>();
  const [notes, setNotes] =
    React.useState<components["schemas"]["LeadNotes"]>();
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchInitialData = async () => {
        try {
          setLoading(true);
          const leadData = await getData(
            `/leads/${encodeURI(phone)}`,
            HttpMethod.GET,
            undefined,
            undefined,
            undefined,
            signal
          );
          setLead(leadData);
          const notesData = await getData("/leads/notes");
        } catch (error) {
          // Handle errors
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    }, 500);

    if (searchParams.has(phone)) setPhone(phone);
    delayedFetch();
    // Cleanup function to cancel the request if component unmounts or state changes
    return () => {
      delayedFetch.cancel();
      controller.abort();
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
      <Grid spacing={3} container>
        <Grid item>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mt: 2,
                  mb: 0,
                  flex: "1",
                  width: "100%",
                }}
              >
                {/*<Divider variant='middle' sx={{ bgcolor: "#000000", borderRadius: 5 }} />*/}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{phone}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardContent></CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
