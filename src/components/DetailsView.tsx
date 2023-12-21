"use client";
import { components } from "@/interfaces/db_interfaces";
import {
  AccountStatus,
  ContactType,
  Gender,
  LeadType,
} from "@/interfaces/enums";
import {
  HttpMethod,
  getAreas,
  getBudgetRanges,
  getCachedData,
  getData,
  getDeliveryRanges,
  getEmployees,
  getJobTitles,
  getProjects,
  getPropertyTypes,
} from "@/utils/api";
import { formatBudgetRange, formatDeliveryRange } from "@/utils/format";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { PhoneNumberUtil } from "google-libphonenumber";
import debounce from "lodash.debounce";
import MuiPhoneNumber from "material-ui-phone-number-2";
import React from "react";

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

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export default function DetailsView({
  type,
  phone,
  setPhone,
  assignedTo,
  setAssignedTo,
}: {
  type: ContactType;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  assignedTo?: number;
  setAssignedTo?: React.Dispatch<React.SetStateAction<number>>;
}) {
  /* States */
  const [phones, setPhones] = React.useState<
    components["schemas"]["AdditionalPhone"][]
  >([]);
  const [editing, setEditing] = React.useState<boolean>(false);
  const [lead, setLead] = React.useState<
    components["schemas"]["Lead"] | components["schemas"]["SalesAccount"]
  >();
  const [status, setStatus] = React.useState<AccountStatus>();
  const [initialLoading, setInitialLoading] = React.useState<boolean>(true);
  const [detailsLoading, setDetailsLoading] = React.useState<boolean>(true);
  const [detailsReload, setDetialsReload] = React.useState<boolean>(false);
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
  const [projects, setProjects] = React.useState<
    components["schemas"]["Project"][]
  >([]);

  /* Params and enpoint */
  const getEndpoint =
    type == ContactType.SALES
      ? `/accounts/sales/${assignedTo}/${phone}`
      : type === ContactType.COMPANY
      ? `/accounts/company/${assignedTo}/${phone}`
      : `/leads/${encodeURI(phone)}`;

  const putEndpoint =
    type == ContactType.SALES
      ? `/accounts/sales/${assignedTo}/${phone}`
      : `/leads/${encodeURI(phone)}`;

  const params =
    type !== ContactType.LEAD
      ? {
          phone: phone,
          assigned_to: assignedTo,
        }
      : {
          phone: phone,
        };

  /* Handlers */
  const handleAddPhone = () => {
    const newPhone: components["schemas"]["AdditionalPhone"] = {
      phone_id: phones.length + 1,
      extra_phone: "",
    };
    setPhones([...phones, newPhone]);
    console.log(phones);
  };

  const handleDeletePhone = (id: number) => {
    const updatedPhones = phones.filter((phone) => phone.phone_id !== id);
    setPhones(updatedPhones);
  };

  const handlePhoneNumberChange = (id: number, extra_phone: string) => {
    const updatedPhones = phones.map((phone) =>
      phone.phone_id === id ? { ...phone, extra_phone } : phone
    );
    setPhones(updatedPhones);

    console.log(phones);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (event.currentTarget.reportValidity() === false) {
      return;
    }

    const phonesStr: string[] = [];
    phones.map((phone) => {
      try {
        const parsedPhoneNumber = phoneNumberUtil.parse(phone.extra_phone);
        if (!phoneNumberUtil.isValidNumber(parsedPhoneNumber)) {
          alert("Invalid phone number");
          return;
        }
        phonesStr.push(phone.extra_phone);
      } catch (error) {
        alert("Invalid phone number");
        return;
      }
    });

    let body: { [key: string]: any } = {
      name: data.get("name"),
      gender: data.get("gender"),
      additional_phones: phonesStr,
      job_title_id: null,
      email: null,
      type_id: parseInt(data.get("type") as string),
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
    if (status) {
      if (type == ContactType.SALES) {
        await getData("/accounts/sales/status", HttpMethod.PUT, {
          ...params,
          status_id: status,
        });
      } else if (type == ContactType.COMPANY) {
        await getData("/accounts/company/status", HttpMethod.PUT, {
          ...params,
          status_id: status,
        });
      }
    }
    try {
      setDetailsLoading(true);
      await getData(putEndpoint, HttpMethod.PUT, undefined, body);
    } finally {
      setPhones([]);
      setDetailsLoading(false);
      setDetialsReload(!detailsReload);
      setEditing(false);
    }
  };

  /* Effects */
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchData = async () => {
        try {
          // fetch data here
          setDetailsLoading(true);
          const leadData = await getData(
            getEndpoint,
            HttpMethod.GET,
            undefined,
            undefined,
            undefined,
            signal
          );
          if (type === ContactType.LEAD) {
            setPhones(leadData.additional_phones);
            setLead(leadData);
          } else if (type === ContactType.SALES) {
            setPhones(leadData.additional_phones);
            setStatus(leadData.status_id);
            setLead(leadData);
          } else {
            setPhones(leadData.lead.additional_phones);
            setStatus(leadData.status_id);
            setLead(leadData.lead);
          }
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
      const fetchInitialData = async () => {
        try {
          setInitialLoading(true);
          const jobData = await getJobTitles(signal);
          setJobTitles(jobData);
          const budgetData = await getBudgetRanges(signal);
          SetBudgetRanges(budgetData);
          const deliveryData = await getDeliveryRanges(signal);
          setDeliveryRanges(deliveryData);
          const propertyData = await getPropertyTypes(signal);
          setPropertyTypes(propertyData);
          const areasData = await getAreas(signal);
          setAreas(areasData);
          const employeeData = await getEmployees(signal);
          setEmployees(employeeData);
          const projectData = await getProjects(signal);
          setProjects(projectData);
        } catch (error) {
          // Handle errors
        } finally {
          setInitialLoading(false);
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
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <AssignmentIndIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Details</Typography>
      </Box>
      {detailsLoading || initialLoading ? (
        <LinearProgress sx={{ my: 2 }} />
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
        <CardContent>
          {!detailsLoading && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField
                required
                sx={viewOnlyStyle}
                variant="standard"
                disabled={!editing}
                defaultValue={lead?.name}
                margin="normal"
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
              />
              <MuiPhoneNumber
                key={0}
                required
                onChange={(value) => setPhone(value.toString())}
                sx={viewOnlyStyle}
                variant="standard"
                disabled={true}
                value={lead?.phone}
                margin="normal"
                id="phone"
                label="Phone Number"
                name="phone"
                defaultCountry={"eg"}
                disableAreaCodes={true}
              />
              {phones &&
                phones.map((phone) => (
                  <Box
                    key={phone.phone_id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <MuiPhoneNumber
                      key={"phone-" + phone.phone_id}
                      sx={{ ...viewOnlyStyle, width: 310 }}
                      variant="standard"
                      disabled={!editing}
                      value={phone.extra_phone}
                      margin="normal"
                      id="phone"
                      label={"Phone Number " + (phone.phone_id + 1)}
                      name="phone"
                      onChange={(value) =>
                        handlePhoneNumberChange(
                          phone.phone_id,
                          value.toString()
                        )
                      }
                      defaultCountry={"eg"}
                      disableAreaCodes={true}
                    />
                    {editing && (
                      <IconButton
                        key={"button-" + phone.phone_id}
                        color="error"
                        onClick={() => handleDeletePhone(phone.phone_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              {editing && (
                <Button startIcon={<AddIcon />} onClick={handleAddPhone}>
                  Add Phone
                </Button>
              )}
              <TextField
                required={!(type === ContactType.SALES)}
                disabled={!editing}
                sx={viewOnlyStyle}
                defaultValue={lead?.interests.at(0)?.project_id}
                select
                variant="standard"
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
              {(type === ContactType.LEAD || type === ContactType.COMPANY) && (
                <TextField
                  margin="normal"
                  select
                  sx={viewOnlyStyle}
                  variant="standard"
                  disabled={!editing}
                  defaultValue={
                    (lead as components["schemas"]["Lead"])?.type_id
                  }
                  fullWidth
                  id="type"
                  label="Type"
                  name="type"
                >
                  <MenuItem value={LeadType.CAMPAIGN}>Campaign</MenuItem>
                  <MenuItem value={LeadType.COLD_CALL}>Cold Call</MenuItem>
                </TextField>
              )}
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
                // disabled={!editing || type === ContactType.SALES}
                disabled={true}
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
                defaultValue={lead?.interests.at(0)?.budget_range?.id}
                disabled={!editing}
                select
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
                defaultValue={lead?.interests.at(0)?.delivery_range?.id}
                select
                disabled={!editing}
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
                defaultValue={lead?.interests.at(0)?.property_type?.id}
                select
                disabled={!editing}
                margin="normal"
                id="propertyType"
                label="Unit Type"
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
                defaultValue={lead?.interests.at(0)?.area_id}
                select
                disabled={!editing}
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
              {type !== ContactType.LEAD && (
                <TextField
                  sx={viewOnlyStyle}
                  variant="standard"
                  select
                  value={status}
                  onChange={(event) =>
                    setStatus(parseInt(event.target.value) as AccountStatus)
                  }
                  disabled={!editing}
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
              {editing && (
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
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
              disabled={detailsLoading || initialLoading}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              disabled={detailsLoading || initialLoading}
              onClick={() => {
                setPhones([]);
                setDetialsReload(!detailsReload);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
