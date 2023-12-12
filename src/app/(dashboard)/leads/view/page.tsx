"use client";

import ActionsCard from "@/components/ActionsCard";
import { components } from "@/interfaces/db_interfaces";
import { ActionType, Gender } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import {
  formatBudgetRange,
  formatDeliveryRange,
  formatReadableDate,
} from "@/utils/format";
import AddCommentIcon from "@mui/icons-material/AddComment";
import AlarmIcon from "@mui/icons-material/Alarm";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CommentIcon from "@mui/icons-material/Comment";
import HistoryIcon from "@mui/icons-material/History";
import {
  Avatar,
  Button,
  CardActions,
  CardHeader,
  Divider,
  Fab,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function ViewLead() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = React.useState<string>(
    searchParams.get("phone") as string
  );
  const viewOnlyStyle = {
    paddingY: 0,
    my: 1,
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "black",
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  };
  const [editing, setEditing] = React.useState<boolean>(false);

  const [lead, setLead] = React.useState<components["schemas"]["Lead"]>();
  const [notes, setNotes] =
    React.useState<components["schemas"]["LeadNotes"][]>();
  const [detailsLoading, setDetailsLoading] = React.useState<boolean>(true);
  const [detailsReload, setDetialsReload] = React.useState<boolean>(false);
  const [actionsLoading, setActionsLoading] = React.useState<boolean>(true);
  const [actionsReload, setActionsReload] = React.useState<boolean>(false);
  const [notesLoading, setNotesLoading] = React.useState<boolean>(true);
  const [notesReload, setNotesReload] = React.useState<boolean>(false);
  const [lastAction, setLastAction] =
    React.useState<components["schemas"]["CompanyAction"]>();
  const [lastActionType, setLastActionType] = React.useState<ActionType>();
  const [nextAction, setNextAction] =
    React.useState<components["schemas"]["CompanyAction"]>();
  const [nextActionType, setNextActionType] = React.useState<ActionType>();

  const [jobTitles, setJobTitles] = React.useState<
    components["schemas"]["JobTitle"][]
  >([]);

  const [budgetRanges, SetBudgetRanges] = React.useState<
    components["schemas"]["RangeMoney"][]
  >([]);
  const [deliveryRanges, setDeliveryRanges] = React.useState<
    components["schemas"]["RangeInt"][]
  >([]);
  const [propertyTypes, setPropertyTypes] = React.useState<
    components["schemas"]["PropertyType"][]
  >([]);
  const [areas, setAreas] = React.useState<components["schemas"]["Area"][]>([]);

  const [employees, setEmployees] = React.useState<
    components["schemas"]["Employee"][]
  >([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.currentTarget.reset();
  };

  const handleNoteAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reportValidity();
    const data = new FormData(event.currentTarget);
    if (data.get("notes") === "") {
      return;
    }
    try {
      setNotesLoading(true);
      await getData("/leads/notes", HttpMethod.POST, undefined, {
        phone: phone,
        notes: data.get("notes"),
      });
    } finally {
      setNotesLoading(false);
    }

    setNotesReload(!notesReload);
  };

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchData = async () => {
        try {
          // fetch data here
          setDetailsLoading(true);
          const jobData = await getData("/job_titles/", HttpMethod.GET);
          setJobTitles(jobData);
          const budgetData = await getData("/budget_ranges/", HttpMethod.GET);
          SetBudgetRanges(budgetData);
          const deliveryData = await getData(
            "/delivery_ranges/",
            HttpMethod.GET
          );
          setDeliveryRanges(deliveryData);
          const propertyData = await getData(
            "/property_types/",
            HttpMethod.GET
          );
          setPropertyTypes(propertyData);
          const areasData = await getData("/areas/", HttpMethod.GET);
          setAreas(areasData);
          const employeeData = await getData("/employees/", HttpMethod.GET);
          setEmployees(employeeData);
          const leadData = await getData(
            `/leads/${encodeURI(phone)}`,
            HttpMethod.GET,
            undefined,
            undefined,
            undefined,
            signal
          );
          setLead(leadData);
        } catch (error) {
          // Handle errors
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchData();
    }, 500);

    delayedFetch();
    // Cleanup function to cancel the request if component unmounts or state changes
    return () => {
      delayedFetch.cancel();
      controller.abort();
    };
  }, [detailsReload]);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchData = async () => {
        try {
          setNotesLoading(true);
          const notesData = await getData(
            "/leads/notes/",
            HttpMethod.GET,
            {
              phone: phone,
            },
            undefined,
            undefined,
            signal
          );
          setNotes(notesData);
        } catch (error) {
          // Handle errors
        } finally {
          setNotesLoading(false);
        }
      };
      fetchData();
    }, 500);

    delayedFetch();
    // Cleanup function to cancel the request if component unmounts or state changes
    return () => {
      delayedFetch.cancel();
      controller.abort();
    };
  }, [notesReload]);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchData = async () => {
        try {
          // fetch data here
          setActionsLoading(true);
          const actionsData = await getData(
            `/leads/${encodeURI(phone)}/actions`,
            HttpMethod.GET,
            undefined,
            undefined,
            undefined,
            signal
          );

          const today = new Date();

          const pastCalls = actionsData.calls.filter(
            (event: any) => new Date(event.date) < today
          );

          const futureCalls = actionsData.calls.filter(
            (event: any) => new Date(event.date) >= today
          );

          const pastMeetings = actionsData.meetings.filter(
            (event: any) => new Date(event.date) < today
          );

          const futureMeetings = actionsData.meetings.filter(
            (event: any) => new Date(event.date) >= today
          );

          let lastAction;
          let nextAction;
          let lastActionType;
          let nextActionType;

          // Find the most recent past action
          const pastActions = [...pastCalls, ...pastMeetings];
          if (pastActions.length > 0) {
            lastAction = pastActions.reduce((prev, current) =>
              new Date(prev.date) > new Date(current.date) ? prev : current
            );
            lastActionType = pastCalls.includes(lastAction)
              ? ActionType.CALL
              : ActionType.MEETING;
          }

          // Find the most next action
          const futureActions = [...futureCalls, ...futureMeetings];
          if (futureActions.length > 0) {
            nextAction = futureActions.reduce((prev, current) =>
              new Date(prev.date) < new Date(current.date) ? prev : current
            );
            nextActionType = futureCalls.includes(nextAction)
              ? ActionType.CALL
              : ActionType.MEETING;
          }
          // Now you can set your state variables
          setLastAction(lastAction);
          setNextAction(nextAction);
          setLastActionType(lastActionType);
          setNextActionType(nextActionType);
        } catch (error) {
          // Handle errors
        } finally {
          setActionsLoading(false);
        }
      };
      fetchData();
    }, 500);

    delayedFetch();
    // Cleanup function to cancel the request if component unmounts or state changes
    return () => {
      delayedFetch.cancel();
      controller.abort();
    };
  }, [actionsReload]);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchInitialData = async () => {
        try {
          const leadData = await getData(
            `/leads/${encodeURI(phone)}`,
            HttpMethod.GET,
            undefined,
            undefined,
            undefined,
            signal
          );
          setLead(leadData);
        } catch (error) {
          // Handle errors
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchInitialData();
    }, 500);

    delayedFetch();
    // Cleanup function to cancel the request if component unmounts or state changes
    return () => {
      delayedFetch.cancel();
      controller.abort();
    };
  }, []);

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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentIndIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Details</Typography>
          </Box>
          {detailsLoading ? (
            <LinearProgress sx={{ mb: 2 }} />
          ) : (
            <Divider sx={{ my: 2 }} />
          )}
          <Card raised>
            {/* <CardHeader
              title="Lead Details"
              sx={{ paddingBottom: 0 }}
              avatar={
                <Avatar>
                  <AssignmentIndIcon />
                </Avatar>
              }
            /> */}
            <CardContent sx={{ minWidth: 350 }}>
              {!detailsLoading && (
                <Box
                  minWidth={350}
                  display={"flex"}
                  flexDirection={"column"}
                  component="form"
                  onSubmit={handleSubmit}
                >
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    disabled={!editing}
                    defaultValue={lead?.name}
                    margin="normal"
                    required
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                  />
                  <MuiPhoneNumber
                    sx={viewOnlyStyle}
                    variant="standard"
                    disabled={!editing}
                    value={lead?.phone}
                    margin="normal"
                    required
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    defaultCountry={"eg"}
                    disableAreaCodes={true}
                  />
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    disabled={!editing}
                    defaultValue={lead?.email}
                    margin="normal"
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                  />
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    disabled={!editing}
                    defaultValue={lead?.gender}
                    margin="normal"
                    select
                    required
                    id="gender"
                    name="gender"
                    label="Gender"
                  >
                    <MenuItem value={Gender.MALE}>Male</MenuItem>
                    <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                  </TextField>
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    defaultValue={lead?.job_title?.id}
                    disabled={!editing}
                    select
                    margin="normal"
                    id="jobTitle"
                    label="Job Title"
                    name="jobTitle"
                    autoComplete="jobTitle"
                  >
                    {jobTitles.map((jobTitle) => (
                      <MenuItem key={jobTitle.id} value={jobTitle.id}>
                        {jobTitle.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    defaultValue={lead?.assigned_to?.id}
                    disabled={!editing}
                    select
                    margin="normal"
                    id="assignedTo"
                    label="Assigned To"
                    name="assignedTo"
                    autoComplete="employee"
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    defaultValue={lead?.interests[0].budget_range?.id}
                    disabled={!editing}
                    select
                    required
                    margin="normal"
                    id="budgetRange"
                    label="Budget Range"
                    name="budgetRange"
                    autoComplete="budgetRange"
                  >
                    {budgetRanges.map((budgetRange) => (
                      <MenuItem key={budgetRange.id} value={budgetRange.id}>
                        {formatBudgetRange(budgetRange)}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    defaultValue={lead?.interests[0].delivery_range?.id}
                    select
                    disabled={!editing}
                    required
                    margin="normal"
                    id="deliveryRange"
                    label="Delivery Range"
                    name="deliveryRange"
                    autoComplete="deliveryRange"
                  >
                    {deliveryRanges.map((deliveryRange) => (
                      <MenuItem key={deliveryRange.id} value={deliveryRange.id}>
                        {formatDeliveryRange(deliveryRange)}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    defaultValue={lead?.interests[0].property_type?.id}
                    select
                    disabled={!editing}
                    required
                    margin="normal"
                    id="propertyType"
                    label="Property Type"
                    name="propertyType"
                    autoComplete="propertyType"
                  >
                    {propertyTypes.map((propertyType) => (
                      <MenuItem key={propertyType.id} value={propertyType.id}>
                        {propertyType.type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    sx={viewOnlyStyle}
                    variant="standard"
                    defaultValue={lead?.interests[0].areas[0]?.area_id}
                    select
                    disabled={!editing}
                    required
                    margin="normal"
                    id="area"
                    label="Area"
                    name="area"
                    autoComplete="area"
                  >
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={area.id}>
                        {area.area}
                      </MenuItem>
                    ))}
                  </TextField>

                  {editing && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Update
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
            <CardActions sx={{ paddingX: 2, paddingTop: 0, paddingBottom: 2 }}>
              {!editing ? (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={detailsLoading}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setDetialsReload(!detailsReload);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        <Grid minWidth={350} item>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CommentIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Notes</Typography>
          </Box>
          {notesLoading ? (
            <LinearProgress sx={{ mb: 2 }} />
          ) : (
            <Divider sx={{ my: 2 }} />
          )}
          <Grid direction={"column"} spacing={2} container>
            {notes?.map((note) => (
              <Grid item>
                <Card
                  sx={{
                    minWidth: 300,
                    borderRadius: 5,
                  }}
                  raised
                >
                  <CardHeader
                    sx={{ paddingBottom: 0 }}
                    avatar={<Avatar>{note.added_by.name.charAt(0)}</Avatar>}
                    title={note.added_by.name}
                    subheader={formatReadableDate(dayjs(note.date_added))}
                  />
                  <CardContent sx={{ paddingTop: 1, paddingBottom: 0 }}>
                    {note.notes}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item>
              <Card
                raised
                sx={{
                  minWidth: 300,
                  borderRadius: 5,
                  position: "relative",
                }}
              >
                <CardContent
                  sx={{
                    paddingTop: 2.6,
                  }}
                >
                  <Box component={"form"} onSubmit={handleNoteAdd}>
                    <TextField
                      id="notes"
                      name="notes"
                      multiline
                      label={"Add Note"}
                      sx={{}}
                    />
                    <Fab
                      color="primary"
                      type="submit"
                      sx={{
                        position: "absolute",
                        bottom: 25, // Adjust the bottom spacing as needed
                        right: 16, // Adjust the right spacing as needed
                      }}
                      aria-label="add"
                    >
                      <AddCommentIcon />
                    </Fab>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid minWidth={350} item>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HistoryIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Last Action</Typography>
          </Box>
          {actionsLoading ? (
            <LinearProgress sx={{ mb: 2 }} />
          ) : (
            <Divider sx={{ my: 2 }} />
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Center horizontally
            }}
          >
            {lastAction && (
              <ActionsCard
                time={new Date(
                  lastAction?.date ? lastAction?.date : new Date()
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
                assignedToName={lastAction.assigned_to.name}
                date={formatReadableDate(dayjs(lastAction?.date))}
                actionType={lastActionType}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AlarmIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Next Follow Up</Typography>
          </Box>
          {actionsLoading ? (
            <LinearProgress sx={{ mb: 2 }} />
          ) : (
            <Divider sx={{ my: 2 }} />
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Center horizontally
            }}
          >
            {nextAction && (
              <ActionsCard
                time={new Date(
                  nextAction?.date ? nextAction?.date : new Date()
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
                assignedToName={nextAction.assigned_to.name}
                date={formatReadableDate(dayjs(nextAction?.date))}
                actionType={nextActionType}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
