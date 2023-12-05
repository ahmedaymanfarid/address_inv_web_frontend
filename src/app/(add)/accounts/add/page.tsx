"use client";
import { components } from "@/interfaces/db_interfaces";
import { Gender } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import { formatBudgetRange, formatDeliveryRange } from "@/utils/format";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
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
import * as React from "react";

export default function AddLead() {
  const phoneNumberUtil = PhoneNumberUtil.getInstance();

  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({
    name: false,
    phone: false,
    email: false,
    gender: false,
    jobTitle: false,
    budgetRange: false,
    deliveryRange: false,
    propertyType: false,
    area: false,
    status: false,
  });

  const [gender, setGender] = React.useState<string>("");

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
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    try {
      const parsedPhoneNumber = phoneNumberUtil.parse(data.get("phone"));
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

    let body: { [key: string]: any } = {
      name: data.get("name"),
      phone: data.get("phone"),
      gender: data.get("gender"),
      job_title_id: null,
      email: null,
      status_id: null,
      interests: [
        {
          budget_range_id: null,
          delivery_range_id: null,
          property_type_id: null,
          area_range_id: null,
          payment_method_id: null,
          areas_ids: [],
        },
      ],
    };

    if (data.get("email") !== "") {
      body["email"] = data.get("email");
    }
    if (data.get("jobTitle") !== "") {
      body["job_title_id"] = parseInt(data.get("jobTitle"));
    }

    if (data.get("budgetRange") !== "") {
      body["interests"][0]["budget_range_id"] = parseInt(
        data.get("budgetRange")
      );
    }

    if (data.get("deliveryRange") !== "") {
      body["interests"][0]["delivery_range_id"] = parseInt(
        data.get("deliveryRange")
      );
    }

    if (data.get("propertyType") !== "") {
      body["interests"][0]["property_type_id"] = parseInt(
        data.get("propertyType")
      );
    }

    if (data.get("area") !== "") {
      body["interests"][0]["areas_ids"].push(parseInt(data.get("area")));
    }

    if (data.get("assignedTo") !== "") {
      body["assigned_to_id"] = parseInt(data.get("assignedTo"));
    }

    if (data.get("status")) {
      body["status_id"] = parseInt(data.get("status"));
    }

    await getData("/accounts/sales", HttpMethod.POST, undefined, body).then(
      (data) => {
        window.location.href = "/accounts";
      }
    );
  };

  React.useEffect(() => {
    const fetchData = async () => {
      // fetch data here
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
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
          />

          <MuiPhoneNumber
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
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
          />
          <TextField
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
            select
            margin="normal"
            fullWidth
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
            select
            required
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
            select
            required
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
            select
            required
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
            select
            required
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
          <TextField
            select
            required
            margin="normal"
            fullWidth
            id="status"
            label="status"
            name="status"
          >
            <MenuItem key={1} value={1}>
              Hot
            </MenuItem>
            <MenuItem key={2} value={2}>
              Warm
            </MenuItem>
            <MenuItem key={3} value={3}>
              Cold
            </MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
