"use client";
import ContactCard from "@/components/ContactsCard";
import { components } from "@/interfaces/db_interfaces";
import { AccountStatus, ContactType } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import { isRefreshTokenExpired } from "@/utils/auth";
import { formatNumber } from "@/utils/format";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TasksPage() {
  if (isRefreshTokenExpired()) {
    window.location.href = "/sign-in";
  }

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [companyAccounts, setCompanyAccounts] = useState<
    components["schemas"]["CompanyAccount"][]
  >([]);
  const [salesAccounts, setSalesAccounts] = useState<
    components["schemas"]["SalesAccount"][]
  >([]);

  const [budgetRanges, SetBudgetRanges] = useState<
    components["schemas"]["RangeMoney"][]
  >([]);
  const [budget, setBudget] = useState("");
  const [budgetRangeID, setBudgetRangeID] = useState<number>();

  const [propertyTypes, setPropertyTypes] = useState<
    components["schemas"]["PropertyType"][]
  >([]);
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyTypeID, setPropertyTypeID] = useState<number>(0);

  const [deliveryRanges, setDeliveryRanges] = useState<
    components["schemas"]["RangeInt"][]
  >([]);
  const [deliveryRange, setDeliveryRange] = useState<string>("");
  const [deliveryRangeID, setDeliveryRangeID] = useState<number>(0);

  const [areas, setAreas] = useState<components["schemas"]["Area"][]>([]);

  const [searchText, setSearchText] = useState<string>("");

  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleBudgetChange = (event: any) => {
    setBudgetRangeID(event.target.value);
    setBudget(event.target.value);
  };

  const handlePropertyTypeChange = (event: any) => {
    setPropertyTypeID(event.target.value);
    setPropertyType(event.target.value);
  };

  const handleDeliveryRangeChange = (event: any) => {
    setDeliveryRangeID(event.target.value);
    setDeliveryRange(event.target.value);
  };
  useEffect(() => {
    const fetchFirstData = async () => {
      const budgetData = await getData("/budget_ranges/");
      SetBudgetRanges(budgetData);
      const propertyData = await getData("/property_types/");
      setPropertyTypes(propertyData);
      const deliveryData = await getData("/delivery_ranges/");
      setDeliveryRanges(deliveryData);
      setFirstLoad(false);
    };

    if (firstLoad) {
      fetchFirstData();
    }

    const fetchData = async () => {
      try {
        let params: { [key: string]: any } = {};
        if (searchText != "") {
          params["search"] = searchText;
        }
        if (budgetRangeID) {
          params["budget_range_id"] = budgetRangeID;
        }

        if (propertyTypeID) {
          params["property_type_id"] = propertyTypeID;
        }

        if (deliveryRangeID) {
          params["delivery_range_id"] = deliveryRangeID;
        }

        const salesAccountsData = await getData(
          "/accounts/sales",
          HttpMethod.GET,
          params
        );
        setSalesAccounts(salesAccountsData);
        const companyAccountsData = await getData(
          "/accounts/company",
          HttpMethod.GET,
          params
        );
        setCompanyAccounts(companyAccountsData);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [searchText, budgetRangeID, propertyTypeID, deliveryRangeID]);
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
              value={budget}
              onChange={handleBudgetChange}
              label="Budget"
            >
              <MenuItem value={0}>None</MenuItem>
              {budgetRanges.map((bg) => (
                <MenuItem key={bg.id} value={bg.id}>
                  {formatNumber(bg.min) + "-" + formatNumber(bg.max)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <InputLabel>Unit Type</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              value={propertyType}
              onChange={handlePropertyTypeChange}
              label="Location Type"
            >
              <MenuItem value={0}>None</MenuItem>
              {propertyTypes.map((pt) => (
                <MenuItem key={pt.id} value={pt.id}>
                  {pt.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <InputLabel>Delivery Range</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              value={deliveryRange}
              onChange={handleDeliveryRangeChange}
              label="Delivery Range"
            >
              <MenuItem value={0}>None</MenuItem>
              {deliveryRanges.map((dr) => (
                <MenuItem key={dr.id} value={dr.id}>
                  {dr.min + "-" + dr.max}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Link href="/accounts/add">
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Link>
        </Grid>
        {/* Add more dropdowns or filters as needed */}
      </Grid>

      <Grid
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <h3
            style={{
              color: "green",
            }}
          >
            New
          </h3>
          <Divider sx={{ mb: 2 }} />
          {companyAccounts
            .filter((account) => {
              if (account.status_id == undefined) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.lead.name}
                  email={account.lead.email}
                  phone={account.phone}
                  jobTitle={account.lead.job_title.title}
                  areaType={account.lead.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.lead.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.lead.interests[0].budget_range.max)
                  }
                  contactType={ContactType.COMPANY}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
          {salesAccounts
            .filter((account) => {
              if (account.status_id == undefined) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.name}
                  email={account.email}
                  phone={account.phone}
                  jobTitle={account.job_title.title}
                  assignedTo={account.assigned_to_id}
                  areaType={account.interests[0].property_type.type}
                  budgetRange={
                    formatNumber(account.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.interests[0].budget_range.max)
                  }
                  contactType={ContactType.SALES}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <h3
            style={{
              color: "indianred",
            }}
          >
            Hot
          </h3>
          <Divider sx={{ mb: 2 }} />
          {companyAccounts
            .filter((account) => {
              if (account.status_id == AccountStatus.HOT) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.lead.name}
                  email={account.lead.email}
                  phone={account.phone}
                  jobTitle={account.lead.job_title.title}
                  areaType={account.lead.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.lead.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.lead.interests[0].budget_range.max)
                  }
                  contactType={ContactType.COMPANY}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
          {salesAccounts
            .filter((account) => {
              if (account.status_id == AccountStatus.HOT) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.name}
                  email={account.email}
                  phone={account.phone}
                  jobTitle={account.job_title.title}
                  areaType={account.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.interests[0].budget_range.max)
                  }
                  contactType={ContactType.SALES}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <h3
            style={{
              color: "darkorange",
            }}
          >
            Warm
          </h3>
          <Divider sx={{ mb: 2 }} />
          {companyAccounts
            .filter((account) => {
              if (account.status_id == AccountStatus.WARM) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.lead.name}
                  email={account.lead.email}
                  phone={account.phone}
                  jobTitle={account.lead.job_title.title}
                  areaType={account.lead.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.lead.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.lead.interests[0].budget_range.max)
                  }
                  contactType={ContactType.COMPANY}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
          {salesAccounts
            .filter((account) => {
              if (account.status_id == AccountStatus.WARM) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.name}
                  email={account.email}
                  phone={account.phone}
                  jobTitle={account.job_title.title}
                  areaType={account.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.interests[0].budget_range.max)
                  }
                  contactType={ContactType.SALES}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <h3
            style={{
              color: "skyblue",
            }}
          >
            Cold
          </h3>
          <Divider sx={{ mb: 2 }} />
          {companyAccounts
            .filter((account) => {
              if (account.status_id == AccountStatus.COLD) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.lead.name}
                  email={account.lead.email}
                  phone={account.phone}
                  jobTitle={account.lead.job_title.title}
                  areaType={account.lead.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.lead.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.lead.interests[0].budget_range.max)
                  }
                  contactType={ContactType.COMPANY}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
          {salesAccounts
            .filter((account) => {
              if (account.status_id == AccountStatus.COLD) return account;
            })
            .map((account: any) => (
              <Grid key={account.id} item>
                <ContactCard
                  name={account.name}
                  email={account.email}
                  phone={account.phone}
                  jobTitle={account.job_title.title}
                  areaType={account.interests[0].property_type.type}
                  assignedTo={account.assigned_to_id}
                  budgetRange={
                    formatNumber(account.interests[0].budget_range.min) +
                    "-" +
                    formatNumber(account.interests[0].budget_range.max)
                  }
                  contactType={ContactType.SALES}
                  assignedToName={account.assigned_to?.name}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
}
