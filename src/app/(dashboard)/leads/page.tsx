"use client";
import ContactCard from "@/components/ContactsCard";
import { components } from "@/interfaces/db_interfaces";
import { ContactType } from "@/interfaces/enums";
import {
  HttpMethod,
  getAreas,
  getBudgetRanges,
  getData,
  getEmployees,
  getProjects,
  getUser,
} from "@/utils/api";
import { isRefreshTokenExpired } from "@/utils/auth";
import { formatBudgetRange } from "@/utils/format";
import AddIcon from "@mui/icons-material/Add";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import SortIcon from "@mui/icons-material/Sort";
import {
  Fab,
  Grid,
  LinearProgress,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import debounce from "lodash.debounce";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  if (isRefreshTokenExpired()) {
    if (typeof window !== "undefined") {
      window.location.href = process.env.BASE_PATH + "/sign-in";
    }
  }
  const [sortBy, setSortBy] = useState<string>("date");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [reloadLeads, setReloadLeads] = useState<boolean>(false);
  const [user, setUser] = useState<components["schemas"]["Employee"]>();
  const [leads, setLeads] = useState<components["schemas"]["Lead"][]>([]);
  const [employees, setEmployees] = useState<
    components["schemas"]["Employee"][]
  >([]);
  const [budgetRanges, SetBudgetRanges] = useState<
    components["schemas"]["RangeMoney"][]
  >([]);
  const [budgetRangeID, setBudgetRangeID] = useState<number>();
  const [locations, setLocations] = useState<components["schemas"]["Area"][]>(
    []
  );
  const [locationID, setLocationID] = useState<number>();
  const [projects, setProjects] = useState<components["schemas"]["Project"][]>(
    []
  );
  const [projectID, setProjectID] = useState<number>();

  // const [propertyTypes, setPropertyTypes] = useState<
  //   components["schemas"]["PropertyType"][]
  // >([]);
  // const [propertyType, setPropertyType] = useState<string>("");
  // const [propertyTypeID, setPropertyTypeID] = useState<number>(0);

  // const [deliveryRanges, setDeliveryRanges] = useState<
  //   components["schemas"]["RangeInt"][]
  // >([]);
  // const [deliveryRange, setDeliveryRange] = useState<string>("");
  // const [deliveryRangeID, setDeliveryRangeID] = useState<number>(0);

  const [areas, setAreas] = useState<components["schemas"]["Area"][]>([]);

  const [searchText, setSearchText] = useState<string>("");

  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleBudgetChange = (event: any) => {
    setBudgetRangeID(event.target.value);
  };

  const handleLocationChange = (event: any) => {
    setLocationID(event.target.value);
  };

  const handleProjectChange = (event: any) => {
    setProjectID(event.target.value);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);

    // handleAssignClose();
  };
  // const handlePropertyTypeChange = (event: any) => {
  //   setPropertyTypeID(event.target.value);
  //   setPropertyType(event.target.value);
  // };

  // const handleDeliveryRangeChange = (event: any) => {
  //   setDeliveryRangeID(event.target.value);
  //   setDeliveryRange(event.target.value);
  // };

  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const [leadLoading, setLeadLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchInitialData = async () => {
        try {
          setFiltersLoading(true);
          const userData = await getUser();
          setUser(userData);
          const budgetData = await getBudgetRanges(signal);
          const locationsData = await getAreas(signal);
          const projectsData = await getProjects(signal);
          // Handle the result
          SetBudgetRanges(budgetData);
          setLocations(locationsData);
          setProjects(projectsData);
          const employeeData = await getEmployees(signal);
          setEmployees(employeeData);
        } catch (error) {
          // Handle errors
        } finally {
          setFiltersLoading(false);
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchLeadData = async () => {
        try {
          setLeadLoading(true);
          let params: { [key: string]: any } = {};
          if (searchText != "") {
            params["search"] = searchText;
          }
          if (budgetRangeID) {
            params["budget_range_id"] = budgetRangeID;
          }

          if (locationID) {
            params["area_id"] = locationID;
          }

          if (projectID !== undefined && projectID !== -1) {
            params["project_id"] = projectID;
          }
          console.log(projectID);
          const data = await getData(
            "/leads/",
            HttpMethod.GET,
            params,
            undefined,
            undefined,
            signal
          );
          setLeads(data);
        } catch (error) {
          console.error("Error fetching leads:", error);
        } finally {
          setLeadLoading(false);
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
  }, [reloadLeads]); // Empty dependency array ensures that the effect runs once after the initial render

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
      <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
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
          <FormControl variant="outlined">
            <InputLabel>Budget</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              value={budgetRangeID}
              onChange={handleBudgetChange}
              label="Budget"
            >
              <MenuItem>None</MenuItem>
              {budgetRanges.map((bg) => (
                <MenuItem key={bg.id} value={bg.id}>
                  {formatBudgetRange(bg)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <InputLabel>Location</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              value={locationID}
              onChange={handleLocationChange}
              label="Location Type"
            >
              <MenuItem>None</MenuItem>
              {locations.map((pt) => (
                <MenuItem key={pt.id} value={pt.id}>
                  {pt.area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <InputLabel>Project</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              value={projectID}
              onChange={handleProjectChange}
              label="Delivery Range"
            >
              <MenuItem>None</MenuItem>
              {projects.map((dr) => (
                <MenuItem key={dr.id} value={dr.id}>
                  {dr.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid sx={{ ml: 1 }} alignItems="center" item>
          <Fab onClick={handleMenuClick}>
            <SortIcon />
          </Fab>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                setSortBy("name");
                handleMenuClose();
              }}
            >
              Name
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortBy("date");
                handleMenuClose();
              }}
            >
              Date Added
            </MenuItem>
          </Menu>
        </Grid>
        <Grid sx={{ ml: 1 }} alignItems="center" item>
          <Link
            href={{
              pathname: "/leads/add",
              query: {
                type: ContactType.LEAD,
              },
            }}
            passHref
          >
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Link>
        </Grid>

        {(filtersLoading || leadLoading) && (
          <Grid item xs={12} alignItems={"center"} textAlign={"center"}>
            <LinearProgress />
          </Grid>
        )}
        {/* Add more dropdowns or filters as needed */}
      </Grid>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {leads && leads.length > 0 ? (
          leads
            .filter((lead: components["schemas"]["Lead"]) => {
              let include = true;
              if (searchText != "") {
                include &&=
                  lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  lead.phone.toLowerCase().includes(searchText.toLowerCase());
              }
              if (budgetRangeID) {
                include &&=
                  lead.interests.at(0)?.budget_range?.id === budgetRangeID;
              }
              if (locationID) {
                include &&= lead.interests.at(0)?.area?.id === locationID;
              }
              if (projectID !== undefined && projectID !== -1) {
                include &&= lead.interests.at(0)?.project?.id === projectID;
              }
              return include;
            })
            .sort((a: any, b: any) => {
              if (sortBy === "name") {
                return a.name.localeCompare(b.name);
              } else if (sortBy === "date") {
                return (
                  new Date(b.date_added).getTime() -
                  new Date(a.date_added).getTime()
                );
              }
            })
            .map((lead: components["schemas"]["Lead"]) => (
              <Grid key={lead.phone} item>
                <ContactCard
                  name={lead.name}
                  // email={lead.email}
                  phone={lead.phone}
                  jobTitle={lead.job_title?.title}
                  area={lead.interests.at(0)?.area?.area}
                  project={lead.interests.at(0)?.project?.name}
                  // areaType={lead.interests.at(0)?.property_type?.type}
                  budgetRange={formatBudgetRange(
                    lead.interests.at(0)?.budget_range as any
                  )}
                  contactType={ContactType.LEAD}
                  employees={employees}
                  leadStatus={lead.status.id}
                  assignedToName={lead.assigned_to?.name}
                  assignedTo={lead.assigned_to_id}
                  reload={reloadLeads}
                  setReload={setReloadLeads}
                  parentLoading={leadLoading}
                />
              </Grid>
            ))
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
            <Typography color="text.secondary" variant="h5">
              No Leads
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
