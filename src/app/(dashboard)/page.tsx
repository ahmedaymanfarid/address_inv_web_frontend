"use client";
import ActionsCard from "@/components/ActionsCard";
import { components } from "@/interfaces/db_interfaces";
import { ActionType } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import { isRefreshTokenExpired } from "@/utils/auth";
import { formatReadableDate } from "@/utils/format";
import AddIcon from "@mui/icons-material/Add";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import TodayIcon from "@mui/icons-material/Today";
import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function HomePage() {
  if (isRefreshTokenExpired()) {
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
  }

  const [actions, setActions] = useState<components["schemas"]["Actions"]>();
  const [searchText, setSearchText] = useState<string>("");
  // default date is today
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));

  const [loading, setLoading] = useState<boolean>(false);
  const handleDateChange = (date: Dayjs | null) => {
    setDate(date);
  };
  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };
  const [fabColor, setFabColor] = useState<string>("default");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchLeadData = async () => {
        try {
          setLoading(true);
          if (date?.isSame(new Date(), "day")) setFabColor("primary");
          else setFabColor("");
          const params = {
            day: date?.format("YYYY-MM-DD"),
            search: searchText,
          };
          const actionsData = await getData(
            "/actions/",
            HttpMethod.GET,
            params,
            undefined,
            undefined,
            signal
          );
          setActions(actionsData);
          console.log(actionsData);
        } catch (error) {
          console.error("Error fetching leads:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchLeadData();
    }, 500);
    // Call the fetchData function
    delayedFetch();
    return () => {
      delayedFetch.cancel();
      controller.abort();
    };
  }, [date, searchText]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item>
            <TextField
              sx={{ minWidth: 200, width: 200 }}
              label="Search"
              variant="outlined"
              value={searchText}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item>
            <DatePicker
              sx={{ minWidth: 200, width: 200 }}
              value={date}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid alignItems="center" item>
            <Fab
              sx={{ ml: 2 }}
              onClick={() => setDate(dayjs(new Date()))}
              aria-label="today"
            >
              <TodayIcon />
            </Fab>
          </Grid>
          <Grid sx={{ mx: 2 }} alignItems="center" item>
            <Link href="/actions/add">
              <Fab color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Link>
          </Grid>
          {/* Add more dropdowns or filters as needed */}
          {loading && (
            <Grid item xs={12} alignItems={"center"} textAlign={"center"}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>

        <Grid container spacing={3}>
          <Grid container spacing={3} item xs={12}>
            <Grid item xs={12}>
              <h3>Calls</h3>
            </Grid>
            {actions?.calls?.length ?? 0 > 0 ? (
              actions?.calls?.map((call) => (
                <Grid key={call.id} item>
                  {call.sales_account ? (
                    <ActionsCard
                      time={new Date(
                        call.date ? call.date : new Date()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      name={call.sales_account.name}
                      phone={call.sales_account.phone}
                      assignedToName={call.assigned_to?.name as string}
                    />
                  ) : (
                    <ActionsCard
                      time={new Date(
                        call.date ? call.date : new Date()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      name={call.company_account?.lead?.name as string}
                      phone={call.company_account?.phone as string}
                      assignedToName={call.assigned_to?.name as string}
                    />
                  )}
                </Grid>
              ))
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h5">
                  No Calls for {formatReadableDate(date)}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid container spacing={3} item xs={12}>
            <Grid item xs={12}>
              <h3>Meetings</h3>
            </Grid>

            {actions?.meetings?.length ?? 0 > 0 ? (
              actions?.meetings?.map((meeting) => (
                <Grid key={meeting.id} item>
                  {meeting.sales_account ? (
                    <ActionsCard
                      time={new Date(
                        meeting.date ? meeting.date : new Date()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      name={meeting.sales_account.name}
                      phone={meeting.sales_account.phone}
                      assignedToName={meeting.assigned_to?.name as string}
                    />
                  ) : (
                    <ActionsCard
                      time={new Date(
                        meeting.date ? meeting.date : new Date()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      name={meeting.company_account?.lead?.name as string}
                      phone={meeting.company_account?.phone as string}
                      assignedToName={meeting.assigned_to?.name as string}
                    />
                  )}
                </Grid>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h5">
                  No Meetings for {formatReadableDate(date)}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}
