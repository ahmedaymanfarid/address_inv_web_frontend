"use client";
import { components } from "@/interfaces/db_interfaces";
import { ContactType } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import { formatReadableDate } from "@/utils/format";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import React from "react";

export default function NotesView({
  type,
  phone,
  assignedTo,
}: {
  type: ContactType;
  phone: string;
  assignedTo?: number;
}) {
  const [note, setNote] = React.useState<string>("");
  const [notes, setNotes] =
    React.useState<components["schemas"]["LeadNotes"][]>();

  const [notesLoading, setNotesLoading] = React.useState<boolean>(true);
  const [notesReload, setNotesReload] = React.useState<boolean>(false);
  const endpoint =
    type === ContactType.SALES ? "/accounts/sales/notes/" : "/leads/notes/";

  const params =
    type === ContactType.SALES
      ? {
          phone: phone,
          assigned_to_id: assignedTo,
        }
      : {
          phone: phone,
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
      const body = { ...params, notes: data.get("notes") };
      await getData(endpoint, HttpMethod.POST, undefined, body);
    } finally {
      setNotesLoading(false);
      setNote("");
    }
    setNotesReload(!notesReload);
  };
  const handleNoteDelete = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      setNotesLoading(true);

      await getData(endpoint, HttpMethod.DELETE, {
        id: parseInt(event.currentTarget.id),
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
          setNotesLoading(true);
          const notesData = await getData(
            endpoint,
            HttpMethod.GET,
            params,
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

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CommentIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Notes</Typography>
      </Box>
      {notesLoading ? (
        <LinearProgress sx={{ my: 2 }} />
      ) : (
        <Divider sx={{ my: 2 }} />
      )}
      <Grid direction={"column"} spacing={2} container>
        {notes?.map((note) => (
          <Grid item>
            <Card
              key={note.id}
              sx={{
                minWidth: 300,
                borderRadius: 5,
              }}
              raised
            >
              <CardHeader
                sx={{ paddingBottom: 0 }}
                avatar={
                  type !== ContactType.SALES ? (
                    <Avatar>{note.added_by.name.charAt(0)}</Avatar>
                  ) : (
                    <Avatar>{note.assigned_to.name.charAt(0)}</Avatar>
                  )
                }
                title={
                  type !== ContactType.SALES
                    ? note.added_by.name
                    : note.assigned_to.name
                }
                subheader={formatReadableDate(dayjs(note.date_added))}
                action={
                  <IconButton
                    id={`${note.id}`}
                    color="error"
                    onClick={handleNoteDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
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
                  onChange={(target) => {
                    setNote(target.currentTarget.value);
                  }}
                  id="notes"
                  name="notes"
                  multiline
                  label={"Add Note"}
                  value={note}
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
    </Box>
  );
}
