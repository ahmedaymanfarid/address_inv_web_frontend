"use client"
import ContactCard from '@/components/ContactsCard';
import { components } from '@/interfaces/db_interfaces';
import { ContactType } from '@/interfaces/enums';
import { HttpMethod, getData } from '@/utils/api';
import { isRefreshTokenExpired } from '@/utils/auth';
import { formatBudgetRange, formatNumber } from '@/utils/format';
import AddIcon from '@mui/icons-material/Add';
import { Fab, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {

  if (isRefreshTokenExpired()) {
    window.location.href = "/sign-in";
  }

  const [leads, setLeads] = useState<components["schemas"]["Lead"][]>([]);

  const [budgetRanges, SetBudgetRanges] = useState<components["schemas"]["RangeMoney"][]>([]);
  const [budget, setBudget] = useState('');
  const [budgetRangeID, setBudgetRangeID] = useState<number>();

  const [propertyTypes, setPropertyTypes] = useState<components["schemas"]["PropertyType"][]>([]);
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertyTypeID, setPropertyTypeID] = useState<number>(0);

  const [deliveryRanges, setDeliveryRanges] = useState<components["schemas"]["RangeInt"][]>([]);
  const [deliveryRange, setDeliveryRange] = useState<string>('');
  const [deliveryRangeID, setDeliveryRangeID] = useState<number>(0);

  const [areas, setAreas] = useState<components["schemas"]["Area"][]>([]);

  const [searchText, setSearchText] = useState<string>('');

  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleBudgetChange = (event: any) => {
    setBudgetRangeID(event.target.value)
    setBudget(event.target.value)
  }

  const handlePropertyTypeChange = (event: any) => {
    setPropertyTypeID(event.target.value);
    setPropertyType(event.target.value)
  }

  const handleDeliveryRangeChange = (event: any) => {
    setDeliveryRangeID(event.target.value)
    setDeliveryRange(event.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params: { [key: string]: any } = {}
        if (searchText != '') {
          params["search"] = searchText
        }
        if (budgetRangeID) {

          params["budget_range_id"] = budgetRangeID
        }

        if (propertyTypeID) {
          params["property_type_id"] = propertyTypeID
        }

        if (deliveryRangeID) {
          params["delivery_range_id"] = deliveryRangeID
        }

        const data = await getData("/leads/", HttpMethod.GET, params);
        setLeads(data);
        const budgetData = await getData("/budget_ranges/")
        SetBudgetRanges(budgetData)
        const propertyData = await getData("/property_types/")
        setPropertyTypes(propertyData)
        const deliveryData = await getData("/delivery_ranges/")
        setDeliveryRanges(deliveryData)
      }
      catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [searchText, budgetRangeID, propertyTypeID, deliveryRangeID]); // Empty dependency array ensures that the effect runs once after the initial render

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
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
              {
                budgetRanges.map((bg) => (
                  <MenuItem key={bg.id} value={bg.id} >
                    {formatNumber(bg.min) + "-" + formatNumber(bg.max)}
                  </MenuItem>
                ))
              }
            </Select>

          </FormControl>
        </Grid>
        <Grid item>

          <FormControl variant="outlined">
            <InputLabel>Location Type</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              value={propertyType}
              onChange={handlePropertyTypeChange}
              label="Location Type"
            >
              <MenuItem value={0}>None</MenuItem>
              {
                propertyTypes.map((pt) => (
                  <MenuItem key={pt.id} value={pt.id} >
                    {pt.type}
                  </MenuItem>
                ))
              }
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
              {
                deliveryRanges.map((dr) => (
                  <MenuItem key={dr.id} value={dr.id} >
                    {dr.min + "-" + dr.max}
                  </MenuItem>
                ))
              }
            </Select>

          </FormControl>
        </Grid>
        <Grid sx={{ mx: 2 }} alignItems='center' container item>
          <Link href="/leads/add" passHref>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Link>
        </Grid>
        {/* Add more dropdowns or filters as needed */}
      </Grid>

      <Grid container rowSpacing={3} columnSpacing={3}>
        {leads.map((lead: components["schemas"]["Lead"]) => (
          <Grid key={lead.id} item>
            <ContactCard
              name={lead.name}
              email={lead.email}
              phone={lead.phone}
              jobTitle={lead.job_title.title}
              areaType={lead.interests[0].property_type.type}
              budgetRange={
                formatBudgetRange(lead.interests[0].budget_range)
              }
              contactType={ContactType.LEAD}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
