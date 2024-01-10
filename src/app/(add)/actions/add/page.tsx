"use client";
import { components } from "@/interfaces/db_interfaces";
import {
  AccountStatus,
  AccountType,
  ActionType,
  ContactType,
  CreateType,
  LeadType,
} from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

import { set } from "date-fns";
import { useSearchParams } from "next/navigation";

export default function AddAction() {
  // account variables
  const searchParams = useSearchParams();

  const [user, setUser] = React.useState<components["schemas"]["Employee"]>();
  const [type, setType] = React.useState<CreateType>(CreateType.CAMPAIGN);
  const [error, setError] = React.useState<string>("");
  const [account, setAccount] = React.useState<string>("");
  const [accountEnabled, setAccountEnabled] = React.useState<boolean>(true);
  const [accountTypeEnabled, setAccountTypeEnabled] =
    React.useState<boolean>(true);
  const [assignedTo, setAssignedTo] = React.useState<number>();
  const [phone, setPhone] = React.useState<string>("");

  // current action variables
  const [currentEnabled, currentSetEnabled] = React.useState<boolean>(false);
  const [currentStatusEnabled, setCurrentStatusEnabled] =
    React.useState<boolean>(false);
  const [currentActionType, setCurrentActionType] = React.useState<string>("");
  const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );

  // follow up variables
  const [followUpEnabled, followUpSetEnabled] = React.useState<boolean>(false);
  const [nextStatusEnabled, setNextStatusEnabled] =
    React.useState<boolean>(false);
  const [nextActionType, setNextActionType] = React.useState<string>("");
  const [nextDate, setNextDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );

  // data variables
  const [salesAccounts, setSalesAccounts] = React.useState<
    components["schemas"]["SalesAccount"][]
  >([]);
  const [companyAccounts, setCompanyAccounts] = React.useState<
    components["schemas"]["CompanyAccount"][]
  >([]);
  const [callStatuses, setCallStatuses] = React.useState<
    components["schemas"]["status"][]
  >([]);
  const [meetingStatuses, setMeetingStatuses] = React.useState<
    components["schemas"]["status"][]
  >([]);
  const [accountStatus, setAccountStatus] = React.useState<AccountStatus>();

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(event.target.value);
    const [phone, assigned_to] = event.target.value.split("~");
    setPhone(phone);
    setAssignedTo(parseInt(assigned_to));
  };

  const createCurrentAction = async (data: FormData) => {
    const body: { [key: string]: any } = {
      assigned_to_id: assignedTo,
      status_id: parseInt(data.get("currentStatus") as string),
      date: currentDate?.format("YYYY-MM-DD HH:mm:ss"),
    };

    let endpoint = "";
    if (type === CreateType.PERSONAL) {
      body["sales_account_phone"] = phone;

      if (currentActionType === ActionType.CALL) {
        endpoint = "/accounts/sales/calls";
      } else if (currentActionType === ActionType.MEETING) {
        endpoint = "/accounts/sales/meetings";
      }
    } else {
      body["company_account_phone"] = phone;
      if (currentActionType === ActionType.CALL) {
        endpoint = "/accounts/company/calls";
      } else if (currentActionType === ActionType.MEETING) {
        endpoint = "/accounts/company/meetings";
      }
    }

    await getData(endpoint, HttpMethod.POST, undefined, body)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
      });
    if (data.get("currentNotes") !== "") {
      const notesBody: { [key: string]: any } = {
        notes: data.get("currentNotes"),
        phone: phone,
      };
      let notesEndpoint = "";
      if (type === CreateType.PERSONAL) {
        notesBody["assigned_to_id"] = assignedTo;
        notesEndpoint = "/accounts/sales/notes";
      } else {
        notesEndpoint = "/leads/notes/";
      }
      await getData(notesEndpoint, HttpMethod.POST, undefined, notesBody);
    }
  };

  const createFollowUpAction = async (data: FormData) => {
    const body: { [key: string]: any } = {
      assigned_to_id: assignedTo,
      status_id: parseInt(data.get("nextStatus") as string),
      date: nextDate?.format("YYYY-MM-DD HH:mm:ss"),
    };

    let endpoint = "";
    if (type === CreateType.PERSONAL) {
      body["sales_account_phone"] = phone;

      if (nextActionType === ActionType.CALL) {
        endpoint = "/accounts/sales/calls";
      } else if (nextActionType === ActionType.MEETING) {
        endpoint = "/accounts/sales/meetings";
      }
    } else {
      body["company_account_phone"] = phone;
      if (nextActionType === ActionType.CALL) {
        endpoint = "/accounts/company/calls";
      } else if (nextActionType === ActionType.MEETING) {
        endpoint = "/accounts/company/meetings";
      }
    }

    await getData(endpoint, HttpMethod.POST, undefined, body)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
      });

    if (data.get("nextNotes") !== "") {
      const notesBody: { [key: string]: any } = {
        notes: data.get("nextNotes"),
        phone: phone,
      };
      let notesEndpoint = "";
      if (type === CreateType.PERSONAL) {
        notesBody["assigned_to_id"] = assignedTo;
        notesEndpoint = "/accounts/sales/notes";
      } else {
        notesEndpoint = "/leads/notes/";
      }
      await getData(notesEndpoint, HttpMethod.POST, undefined, notesBody).catch(
        (error) => {
          setError(error.message);
        }
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reportValidity();
    const data = new FormData(event.currentTarget);
    if (currentEnabled) {
      await createCurrentAction(data);
    }
    if (followUpEnabled) {
      await createFollowUpAction(data);
    }
    window.location.href = process.env.BASE_PATH + "/";
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getData("/accounts/sales", HttpMethod.GET).then((data) => {
        setSalesAccounts(data);
      });
      await getData("/accounts/company", HttpMethod.GET).then((data) => {
        setCompanyAccounts(data);
      });
      await getData("/call_statuses/", HttpMethod.GET).then((data) => {
        setCallStatuses(data);
      });
      await getData("/meeting_statuses/", HttpMethod.GET).then((data) => {
        setMeetingStatuses(data);
        console.log(data);
      });
    };
    fetchData();
    if (searchParams.has("accountType")) {
      setType(searchParams.get("accountType") as CreateType);
    }
    if (searchParams.has("phone") && searchParams.has("assignedTo")) {
      setAccount(
        `${searchParams.get("phone")}~${searchParams.get("assignedTo")}`
      );
      setAssignedTo(parseInt(searchParams.get("assignedTo") as string));
      setPhone(searchParams.get("phone") as string);
      setAccountTypeEnabled(false);
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PersonAddAlt1Icon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Action
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              select
              value={type}
              onChange={(event) => {
                setAccountEnabled(true);
                setType(event.target.value as CreateType);
              }}
              fullWidth
              id="type"
              label="Source"
              name="type"
            >
              <MenuItem value={CreateType.CAMPAIGN}>Campaign</MenuItem>
              <MenuItem value={CreateType.COLD_CALL}>Cold Call</MenuItem>
              {(searchParams.get("type") as ContactType) !==
                ContactType.LEAD && (
                <MenuItem value={CreateType.PERSONAL}>Personal</MenuItem>
              )}
            </TextField>
            <TextField
              select
              disabled={!accountEnabled}
              margin="normal"
              required
              fullWidth
              value={account}
              onChange={handleAccountChange}
              id="account"
              label="Account"
              name="account"
              autoComplete="name"
            >
              {type &&
                (type === CreateType.PERSONAL
                  ? salesAccounts.map((account) => (
                      <MenuItem
                        key={`${account.phone}~${account.assigned_to_id}`}
                        value={`${account.phone}~${account.assigned_to_id}`}
                      >
                        {account.name}
                      </MenuItem>
                    ))
                  : type === CreateType.CAMPAIGN
                  ? companyAccounts
                      .filter((account) => {
                        return account.lead.type_id === LeadType.CAMPAIGN;
                      })
                      .map((account) => (
                        <MenuItem
                          key={`${account.phone}~${account.assigned_to_id}`}
                          value={`${account.phone}~${account.assigned_to_id}`}
                        >
                          {account.lead.name}
                        </MenuItem>
                      ))
                  : companyAccounts
                      .filter((account) => {
                        return account.lead.type_id === LeadType.COLD_CALL;
                      })
                      .map((account) => (
                        <MenuItem
                          key={`${account.phone}~${account.assigned_to_id}`}
                          value={`${account.phone}~${account.assigned_to_id}`}
                        >
                          {account.lead.name}
                        </MenuItem>
                      )))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  value={currentEnabled}
                  onChange={(event) => {
                    currentSetEnabled(event.target.checked);
                  }}
                />
              }
              label={<span style={{ fontSize: "1.6rem" }}>Current Action</span>}
            />
            <TextField
              disabled={!currentEnabled}
              select
              required
              margin="normal"
              fullWidth
              id="currentType"
              label="Type"
              name="currentType"
              value={currentActionType}
              onChange={(event) => {
                setCurrentActionType(event.target.value);
                setCurrentStatusEnabled(true);
              }}
            >
              <MenuItem value={ActionType.CALL}>Call</MenuItem>
              <MenuItem value={ActionType.MEETING}>Meeting</MenuItem>
            </TextField>
            <TextField
              select
              disabled={!(currentEnabled && currentStatusEnabled)}
              required
              margin="normal"
              fullWidth
              id="currentStatus"
              label="status"
              name="currentStatus"
            >
              {currentActionType != "" ? (
                currentActionType === ActionType.CALL ? (
                  callStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.status}
                    </MenuItem>
                  ))
                ) : (
                  meetingStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.status}
                    </MenuItem>
                  ))
                )
              ) : (
                <></>
              )}
            </TextField>
            <DateTimePicker
              disabled={!currentEnabled}
              sx={{ width: "100%", mt: 2, mb: 1 }}
              label="Date *"
              value={currentDate}
              onChange={(date) => {
                setCurrentDate(date);
              }}
              maxDate={dayjs(new Date())}
            />
            <TextField
              disabled={!currentEnabled}
              margin="normal"
              multiline
              fullWidth
              id="currentNotes"
              label="Notes"
              name="currentNotes"
            />

            <FormControlLabel
              control={
                <Checkbox
                  value={followUpEnabled}
                  onChange={(event) => {
                    followUpSetEnabled(event.target.checked);
                  }}
                />
              }
              label={<span style={{ fontSize: "1.6rem" }}> Follow Up</span>}
            />
            <TextField
              disabled={!followUpEnabled}
              select
              required
              margin="normal"
              fullWidth
              id="type"
              label="Type"
              name="type"
              value={nextActionType}
              onChange={(event) => {
                setNextActionType(event.target.value);
                setNextStatusEnabled(true);
              }}
            >
              <MenuItem value={ActionType.CALL}>Call</MenuItem>
              <MenuItem value={ActionType.MEETING}>Meeting</MenuItem>
            </TextField>
            <TextField
              select
              disabled={!(followUpEnabled && nextStatusEnabled)}
              required
              margin="normal"
              fullWidth
              id="nextStatus"
              label="Status"
              name="nextStatus"
            >
              {nextActionType != "" ? (
                nextActionType === ActionType.CALL ? (
                  callStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.status}
                    </MenuItem>
                  ))
                ) : (
                  meetingStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.status}
                    </MenuItem>
                  ))
                )
              ) : (
                <></>
              )}
            </TextField>
            <DateTimePicker
              disabled={!followUpEnabled}
              sx={{ width: "100%", mt: 2, mb: 1 }}
              label="Date *"
              value={nextDate}
              onChange={(date) => {
                setNextDate(date);
              }}
              minDate={dayjs(new Date())}
            />

            <TextField
              disabled={!followUpEnabled}
              margin="normal"
              multiline
              fullWidth
              id="nextNotes"
              label="Notes"
              name="nextNotes"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              disabled={!(currentEnabled || followUpEnabled)}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
