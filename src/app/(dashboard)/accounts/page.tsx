"use client";
import ContactCard from "@/components/ContactsCard";
import { components } from "@/interfaces/db_interfaces";
import { AccountStatus, ContactType } from "@/interfaces/enums";
import {
  HttpMethod,
  getAreas,
  getBudgetRanges,
  getData,
  getEmployees,
  getProjects,
} from "@/utils/api";
import { isRefreshTokenExpired } from "@/utils/auth";
import { formatBudgetRange, formatNumber } from "@/utils/format";
import AddIcon from "@mui/icons-material/Add";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TasksPage() {
  if (isRefreshTokenExpired()) {
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
  }
  const [accountReload, setAccountReload] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [employees, setEmployees] = useState<
    components["schemas"]["Employee"][]
  >([]);

  const [companyAccounts, setCompanyAccounts] = useState<
    components["schemas"]["CompanyAccount"][]
  >([]);
  const [salesAccounts, setSalesAccounts] = useState<
    components["schemas"]["SalesAccount"][]
  >([]);

  const [budgetRanges, SetBudgetRanges] = useState<
    components["schemas"]["RangeMoney"][]
  >([]);
  const [budgetRangeID, setBudgetRangeID] = useState<number>();

  const [areas, setAreas] = useState<components["schemas"]["Area"][]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [locations, setLocations] = useState<components["schemas"]["Area"][]>(
    []
  );
  const [locationID, setLocationID] = useState<number>();
  const [projects, setProjects] = useState<components["schemas"]["Project"][]>(
    []
  );

  const handleLocationChange = (event: any) => {
    setLocationID(event.target.value);
  };

  const handleProjectChange = (event: any) => {
    setProjectID(event.target.value);
  };
  const [projectID, setProjectID] = useState<number>();
  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleBudgetChange = (event: any) => {
    setBudgetRangeID(event.target.value);
  };

  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const [accountLoading, setAccountLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchInitialData = async () => {
        try {
          setFiltersLoading(true);
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
          setAccountLoading(true);
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

          const salesAccountsData = await getData(
            "/accounts/sales",
            HttpMethod.GET,
            params,
            undefined,
            undefined,
            signal
          );
          const companyAccountsData = await getData(
            "/accounts/company",
            HttpMethod.GET,
            params,
            undefined,
            undefined,
            signal
          );
          setSalesAccounts(salesAccountsData);
          setCompanyAccounts(companyAccountsData);
        } catch (error) {
          console.error("Error fetching leads:", error);
        } finally {
          setAccountLoading(false);
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
  }, [accountReload]);
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
        <Grid item>
          <Link
            href={{
              pathname: "/leads/add",
            }}
          >
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Link>
        </Grid>
        {(filtersLoading || accountLoading) && (
          <Grid item xs={12} alignItems={"center"} textAlign={"center"}>
            <LinearProgress />
          </Grid>
        )}
        {/* Add more dropdowns or filters as needed */}
      </Grid>

      <Grid container rowSpacing={3} columnSpacing={2}>
        <Grid item container columnSpacing={2} xs={12}>
          <Grid item xs={12}>
            <h3
              style={{
                color: "green",
              }}
            >
              New
            </h3>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {companyAccounts &&
            salesAccounts &&
            companyAccounts.filter((account) => {
              if (account.status_id == AccountStatus.NEW) return account;
            }).length == 0 &&
            salesAccounts.filter((account) => {
              if (account.status_id == AccountStatus.NEW) return account;
            }).length == 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h5">
                  Empty
                </Typography>
              </Box>
            )}
          {companyAccounts &&
            companyAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.NEW;
                if (searchText != "") {
                  include &&=
                    account.lead.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.lead.interests.at(0)?.budget_range?.id ==
                    budgetRangeID;
                }
                if (locationID) {
                  include &&=
                    account.lead.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&=
                    account.lead.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.lead.name}
                    // email={account.lead.email}
                    phone={account.phone}
                    jobTitle={account.lead.job_title?.title}
                    area={account.lead.interests.at(0)?.area?.area}
                    project={account.lead.interests.at(0)?.project?.name}
                    // area=Type={account.lead.interests.at(0)?.property_type?.type}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.lead.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.COMPANY}
                    assignedToName={account.assigned_to?.name}
                    leadStatus={account.lead.status.id}
                    accountStatus={account.status_id}
                    employees={employees}
                    leadType={account.lead.type_id}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
          {salesAccounts &&
            salesAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.NEW;
                if (searchText != "") {
                  include &&=
                    account.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.interests.at(0)?.budget_range?.id == budgetRangeID;
                }
                if (locationID) {
                  include &&= account.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&= account.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.name}
                    // email={account.email}
                    phone={account.phone}
                    jobTitle={account.job_title?.title}
                    assignedTo={account.assigned_to_id}
                    area={account.interests.at(0)?.area?.area}
                    project={account.interests.at(0)?.project?.name}
                    // areaType={account.interests.at(0)?.property_type?.type}
                    budgetRange={formatBudgetRange(
                      account.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.SALES}
                    accountStatus={account.status_id}
                    assignedToName={account.assigned_to?.name}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
        </Grid>

        <Grid item container columnSpacing={2} xs={12}>
          <Grid item xs={12}>
            <h3
              style={{
                color: "indianred",
              }}
            >
              Hot
            </h3>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {companyAccounts &&
            salesAccounts &&
            companyAccounts.filter((account) => {
              if (account.status_id == AccountStatus.HOT) return account;
            }).length == 0 &&
            salesAccounts.filter((account) => {
              if (account.status_id == AccountStatus.HOT) return account;
            }).length == 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h5">
                  Empty
                </Typography>
              </Box>
            )}
          {companyAccounts &&
            companyAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.HOT;
                if (searchText != "") {
                  include &&=
                    account.lead.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.lead.interests.at(0)?.budget_range?.id ==
                    budgetRangeID;
                }
                if (locationID) {
                  include &&=
                    account.lead.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&=
                    account.lead.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.lead.name}
                    // email={account.lead.email}
                    phone={account.phone}
                    jobTitle={account.lead.job_title?.title}
                    area={account.lead.interests.at(0)?.area?.area}
                    project={account.lead.interests.at(0)?.project?.name}
                    // areaType={account.lead.interests.at(0)?.property_type?.type}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.lead.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.COMPANY}
                    assignedToName={account.assigned_to?.name}
                    leadStatus={account.lead.status.id}
                    accountStatus={account.status_id}
                    employees={employees}
                    leadType={account.lead.type_id}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
          {salesAccounts &&
            salesAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.HOT;
                if (searchText != "") {
                  include &&=
                    account.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.interests.at(0)?.budget_range?.id == budgetRangeID;
                }
                if (locationID) {
                  include &&= account.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&= account.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.name}
                    // email={account.email}
                    phone={account.phone}
                    jobTitle={account.job_title?.title}
                    // areaType={account.interests.at(0)?.property_type?.type}
                    area={account.interests.at(0)?.area?.area}
                    project={account.interests.at(0)?.project?.name}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.SALES}
                    accountStatus={account.status_id}
                    assignedToName={account.assigned_to?.name}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
        </Grid>
        <Grid item container columnSpacing={2} xs={12}>
          <Grid item xs={12}>
            <h3
              style={{
                color: "darkorange",
              }}
            >
              Warm
            </h3>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {companyAccounts &&
            salesAccounts &&
            companyAccounts.filter((account) => {
              if (account.status_id == AccountStatus.WARM) return account;
            }).length == 0 &&
            salesAccounts.filter((account) => {
              if (account.status_id == AccountStatus.WARM) return account;
            }).length == 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h5">
                  Empty
                </Typography>
              </Box>
            )}

          {companyAccounts &&
            companyAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.WARM;
                if (searchText != "") {
                  include &&=
                    account.lead.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.lead.interests.at(0)?.budget_range?.id ==
                    budgetRangeID;
                }
                if (locationID) {
                  include &&=
                    account.lead.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&=
                    account.lead.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.lead.name}
                    // email={account.lead.email}
                    phone={account.phone}
                    jobTitle={account.lead.job_title?.title}
                    area={account.lead.interests.at(0)?.area?.area}
                    project={account.lead.interests.at(0)?.project?.name}
                    // areaType={account.lead.interests.at(0)?.property_type?.type}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.lead.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.COMPANY}
                    assignedToName={account.assigned_to?.name}
                    leadStatus={account.lead.status.id}
                    accountStatus={account.status_id}
                    employees={employees}
                    leadType={account.lead.type_id}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
          {salesAccounts &&
            salesAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.WARM;
                if (searchText != "") {
                  include &&=
                    account.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.interests.at(0)?.budget_range?.id == budgetRangeID;
                }
                if (locationID) {
                  include &&= account.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&= account.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.name}
                    // email={account.email}
                    phone={account.phone}
                    jobTitle={account.job_title?.title}
                    area={account.interests.at(0)?.area?.area}
                    project={account.interests.at(0)?.project?.name}
                    // areaType={account.interests.at(0)?.property_type?.type}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.SALES}
                    accountStatus={account.status_id}
                    assignedToName={account.assigned_to?.name}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
        </Grid>

        <Grid item container columnSpacing={2} xs={12}>
          <Grid item xs={12}>
            <h3
              style={{
                color: "skyblue",
              }}
            >
              Cold
            </h3>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          {companyAccounts &&
            salesAccounts &&
            companyAccounts.filter((account) => {
              if (account.status_id == AccountStatus.COLD) return account;
            }).length == 0 &&
            salesAccounts.filter((account) => {
              if (account.status_id == AccountStatus.COLD) return account;
            }).length == 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h5">
                  Empty
                </Typography>
              </Box>
            )}
          {companyAccounts &&
            companyAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.COLD;
                if (searchText != "") {
                  include &&=
                    account.lead.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.lead.interests.at(0)?.budget_range?.id ==
                    budgetRangeID;
                }
                if (locationID) {
                  include &&=
                    account.lead.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&=
                    account.lead.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.lead.name}
                    // email={account.lead.email}
                    phone={account.phone}
                    jobTitle={account.lead.job_title?.title}
                    area={account.lead.interests.at(0)?.area?.area}
                    project={account.lead.interests.at(0)?.project?.name}
                    // areaType={account.lead.interests.at(0)?.property_type?.type}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.lead.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.COMPANY}
                    assignedToName={account.assigned_to?.name}
                    leadStatus={account.lead.status.id}
                    accountStatus={account.status_id}
                    employees={employees}
                    leadType={account.lead.type_id}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
          {salesAccounts &&
            salesAccounts
              .filter((account) => {
                let include = account.status_id == AccountStatus.COLD;
                if (searchText != "") {
                  include &&=
                    account.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    account.phone
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                }
                if (budgetRangeID) {
                  include &&=
                    account.interests.at(0)?.budget_range?.id == budgetRangeID;
                }
                if (locationID) {
                  include &&= account.interests.at(0)?.area?.id == locationID;
                }
                if (projectID !== undefined && projectID !== -1) {
                  include &&= account.interests.at(0)?.project?.id == projectID;
                }
                return include;
              })
              .map((account) => (
                <Grid key={`${account.assigned_to_id}-${account.phone}`} item>
                  <ContactCard
                    name={account.name}
                    // email={account.email}
                    phone={account.phone}
                    jobTitle={account.job_title?.title}
                    area={account.interests.at(0)?.area?.area}
                    project={account.interests.at(0)?.project?.name}
                    // areaType={account.interests.at(0)?.property_type?.type}
                    assignedTo={account.assigned_to_id}
                    budgetRange={formatBudgetRange(
                      account.interests.at(0)?.budget_range as any
                    )}
                    contactType={ContactType.SALES}
                    accountStatus={account.status_id}
                    assignedToName={account.assigned_to?.name}
                    reload={accountReload}
                    setReload={setAccountReload}
                    parentLoading={accountLoading}
                  />
                </Grid>
              ))}
        </Grid>
      </Grid>
    </Box>
  );
}
