"use client";
import { components } from "@/interfaces/db_interfaces";
import {
  AccountStatus,
  ContactType,
  CreateType,
  Gender,
  LeadType,
} from "@/interfaces/enums";
import { AdminOwnerTeamLeader } from "@/interfaces/scopes";
import { HttpMethod, getData, getUser } from "@/utils/api";
import { formatBudgetRange, formatDeliveryRange } from "@/utils/format";
import AddIcon from "@mui/icons-material/Add";
import AddCommentIcon from "@mui/icons-material/AddComment";
import AlarmIcon from "@mui/icons-material/Alarm";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HistoryIcon from "@mui/icons-material/History";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { IconButton, LinearProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { PhoneNumberUtil } from "google-libphonenumber";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { useSearchParams } from "next/navigation";
import * as React from "react";
interface Phone {
  id: number;
  number: string;
}
const phoneNumberUtil = PhoneNumberUtil.getInstance();

export default function AddLead() {
  const searchParams = useSearchParams();
  /* States */
  const [user, setUser] = React.useState<components["schemas"]["Employee"]>();
  const [type, setType] = React.useState<CreateType>(CreateType.CAMPAIGN);
  const [gender, setGender] = React.useState<string>(Gender.MALE);
  const [phones, setPhones] = React.useState<Phone[]>([]);
  const [assignedTo, setAssignedTo] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
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

  const [projects, setProjects] = React.useState<
    components["schemas"]["Project"][]
  >([]);
  const [employees, setEmployees] = React.useState<
    components["schemas"]["Employee"][]
  >([]);

  /* endpoint */

  const endpoint = type === CreateType.PERSONAL ? "/accounts/sales" : "/leads/";

  /* Handlers */
  const handleAddPhone = () => {
    const newPhone: Phone = { id: phones.length + 1, number: "" };
    setPhones([...phones, newPhone]);
  };
  const handleDeletePhone = (id: number) => {
    const updatedPhones = phones.filter((phone) => phone.id !== id);
    setPhones(updatedPhones);
  };
  const handlePhoneNumberChange = (id: number, number: string) => {
    const updatedPhones = phones.map((phone) =>
      phone.id === id ? { ...phone, number } : phone
    );
    setPhones(updatedPhones);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const parsedPhoneNumber = phoneNumberUtil.parse(
        data.get("phone") as string
      );
      if (!phoneNumberUtil.isValidNumber(parsedPhoneNumber)) {
        alert("Invalid phone number");
        return;
      }
    } catch (error) {
      alert("Invalid phone number");
      return;
    }

    if (event.currentTarget.reportValidity() === false) {
      return;
    }

    const phonesStr: string[] = [];

    phones.map((phone) => {
      try {
        const parsedPhoneNumber = phoneNumberUtil.parse(phone.number);
        if (!phoneNumberUtil.isValidNumber(parsedPhoneNumber)) {
          alert("Invalid phone number");
          return;
        }
        phonesStr.push(phone.number);
      } catch (error) {
        alert("Invalid phone number");
        return;
      }
    });

    let body: { [key: string]: any } = {
      name: data.get("name"),
      phone: data.get("phone"),
      gender: data.get("gender"),
      job_title_id: null,
      email: null,
      additional_phones: phonesStr,
      interests: [
        {
          budget_range_id: null,
          delivery_range_id: null,
          property_type_id: null,
          area_range_id: null,
          payment_method_id: null,
          area_id: null,
          project_id: null,
        },
      ],
    };

    if (data.get("email") !== "") {
      body["email"] = data.get("email");
    }
    if (data.get("jobTitle") !== "") {
      body["job_title_id"] = parseInt(data.get("jobTitle") as string);
    }

    if (data.get("budgetRange") !== "") {
      body["interests"][0]["budget_range_id"] = parseInt(
        data.get("budgetRange") as string
      );
    }

    if (data.get("deliveryRange") !== "") {
      body["interests"][0]["delivery_range_id"] = parseInt(
        data.get("deliveryRange") as string
      );
    }

    if (data.get("propertyType") !== "") {
      body["interests"][0]["property_type_id"] = parseInt(
        data.get("propertyType") as string
      );
    }

    if (data.get("area") !== "") {
      body["interests"][0]["area_id"] = parseInt(data.get("area") as string);
    }

    if (data.get("project") !== "") {
      body["interests"][0]["project_id"] = parseInt(
        data.get("project") as string
      );
    }

    let params: { [key: string]: any } = {};
    if (type === CreateType.PERSONAL) {
      body["status_id"] = data.get("status");
      body["assigned_to"] = assignedTo;
    } else {
      if (type === CreateType.CAMPAIGN) {
        body["type_id"] = LeadType.CAMPAIGN;
      } else {
        body["type_id"] = LeadType.COLD_CALL;
      }
      if (data.get("assignedTo") !== "") {
        params["assigned_to"] = data.get("assignedTo");
      }
    }

    await getData(endpoint, HttpMethod.POST, params, body).then((data) => {
      if (type !== CreateType.PERSONAL) {
        window.location.href = "/leads";
      } else {
        window.location.href = "/accounts";
      }
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      // fetch data here
      try {
        setLoading(true);
        await getUser().then((data) => {
          setUser(data);
          setAssignedTo(data.id);
        });
        await getData("/job_titles/", HttpMethod.GET).then((data) => {
          setJobTitles(data);
        });
        await getData("/budget_ranges/", HttpMethod.GET).then((data) => {
          SetBudgetRanges(data);
        });
        await getData("/delivery_ranges/", HttpMethod.GET).then((data) => {
          setDeliveryRanges(data);
        });
        await getData("/property_types/", HttpMethod.GET).then((data) => {
          setPropertyTypes(data);
        });
        await getData("/areas/", HttpMethod.GET).then((data) => {
          setAreas(data);
        });
        await getData("/employees/", HttpMethod.GET).then((data) => {
          setEmployees(data);
        });
        await getData("/projects/", HttpMethod.GET).then((data) => {
          setProjects(data);
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
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
          Create Contact
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {loading && <LinearProgress />}
          <TextField
            disabled={loading}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
          />

          <MuiPhoneNumber
            disabled={loading}
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            variant="outlined"
            defaultCountry={"eg"}
            disableAreaCodes={true}
          />
          {phones.map((phone) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <MuiPhoneNumber
                sx={{ width: 350 }}
                disabled={loading}
                variant="outlined"
                value={phone.number}
                margin="normal"
                label={"Phone Number " + (phone.id + 1)}
                onChange={(value) =>
                  handlePhoneNumberChange(phone.id, value.toString())
                }
                defaultCountry={"eg"}
                disableAreaCodes={true}
              />
              <IconButton
                color="error"
                onClick={() => handleDeletePhone(phone.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddPhone}>
            Add Phone
          </Button>
          <TextField
            disabled={loading}
            margin="normal"
            select
            value={type}
            onChange={(event) => {
              setType(event.target.value as CreateType);
              if ((event.target.value as CreateType) === CreateType.PERSONAL) {
                setAssignedTo(user?.id as number);
              }
            }}
            fullWidth
            id="type"
            label="Source"
            name="type"
          >
            <MenuItem value={CreateType.CAMPAIGN}>Campaign</MenuItem>
            <MenuItem value={CreateType.COLD_CALL}>Cold Call</MenuItem>
            {(searchParams.get("type") as ContactType) !== ContactType.LEAD && (
              <MenuItem value={CreateType.PERSONAL}>Personal</MenuItem>
            )}
          </TextField>
          <TextField
            disabled={loading}
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
          />
          <TextField
            disabled={loading}
            margin="normal"
            select
            required
            fullWidth
            id="gender"
            name="gender"
            label="Gender"
            onChange={(event) => {
              setGender(event.target.value);
            }}
            value={gender}
          >
            <MenuItem value={Gender.MALE}>Male</MenuItem>
            <MenuItem value={Gender.FEMALE}>Female</MenuItem>
          </TextField>
          <TextField
            disabled={loading}
            select
            margin="normal"
            fullWidth
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
            disabled={loading}
            select
            required={!(type === CreateType.PERSONAL)}
            margin="normal"
            fullWidth
            id="project"
            label="Project"
            name="project"
            autoComplete="project"
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
          {type === CreateType.PERSONAL && (
            <TextField
              disabled={loading}
              fullWidth
              select
              defaultValue={AccountStatus.HOT}
              margin="normal"
              id="status"
              label="Status"
              name="status"
            >
              <MenuItem key={AccountStatus.HOT} value={AccountStatus.HOT}>
                Hot
              </MenuItem>
              <MenuItem key={AccountStatus.WARM} value={AccountStatus.WARM}>
                Warm
              </MenuItem>
              <MenuItem key={AccountStatus.COLD} value={AccountStatus.COLD}>
                Cold
              </MenuItem>
            </TextField>
          )}
          {AdminOwnerTeamLeader.includes(user?.position.id as number) && (
            <TextField
              disabled={loading}
              select
              value={assignedTo}
              required={type === CreateType.PERSONAL}
              onChange={(event) => {
                setAssignedTo(parseInt(event.target.value));
              }}
              margin="normal"
              fullWidth
              id="assignedTo"
              label="Assigned To"
              name="assignedTo"
              autoComplete="employee"
            >
              {type !== CreateType.PERSONAL && (
                <MenuItem key={0} value={""}>
                  None
                </MenuItem>
              )}
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            disabled={loading}
            select
            margin="normal"
            fullWidth
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
            disabled={loading}
            select
            margin="normal"
            fullWidth
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
            disabled={loading}
            select
            margin="normal"
            fullWidth
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
            disabled={loading}
            select
            margin="normal"
            fullWidth
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
          <Button
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
  );
}
