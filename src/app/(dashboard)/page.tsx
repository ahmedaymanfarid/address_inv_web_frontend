"use client"
import ContactCard from '@/components/ContactsCard';
import { components } from '@/interfaces/db_interfaces';
import { ContactType } from '@/interfaces/enums';
import { HttpMethod, getData } from '@/utils/api';
import { isRefreshTokenExpired } from '@/utils/auth';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

export default function HomePage() {

  if (isRefreshTokenExpired()) {
    window.location.href = "/sign-in";
  }

  const [actions, setActions] = useState<(components["schemas"]["Actions"])>();
  const [searchText, setSearchText] = useState<string>('');
  // default date is today
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date));
  const handleDateChange = (date: Dayjs | null) => {
    setDate(date);
  }
  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    // fetch data here
    const fetchData = async () => {
      const params = {
        day: date?.format('YYYY-MM-DD'),
        search: searchText,
      }
      const actionsData = await getData('/actions/', HttpMethod.GET, params);
      setActions(actionsData);
      console.log(actionsData);
    }
    fetchData();
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
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
            <DatePicker
              value={date}
              onChange={handleDateChange}
            />
          </Grid>
          <Grid sx={{ mx: 2 }} alignItems='center' container item>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Grid>
          {/* Add more dropdowns or filters as needed */}
        </Grid>

        <Grid container rowSpacing={3} columnSpacing={3}>
          <Grid item>
            <h3>Calls</h3>
            {actions?.calls?.map((call) => (
              <Grid key={call.id} item>
                {call.sales_account ? (
                  <ContactCard name={call.sales_account.name} phone={call.sales_account.phone} contactType={ContactType.SALES} />
                ) : (
                  <ContactCard name={call.company_account.name} phone={call.company_account?.phone} contactType={ContactType.COMPANY} />
                )}

              </Grid>
            ))}
          </Grid>
          <Grid item>
            {actions?.meetings?.map((meeting) => (
              <Grid key={meeting.id} item>
                {meeting.sales_account ? (
                  <ContactCard name={meeting.sales_account.name} phone={meeting.sales_account.phone} contactType={ContactType.SALES} />
                ) : (
                  <ContactCard name={meeting.company_account.name} phone={meeting.company_account?.phone} contactType={ContactType.COMPANY} />
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box >
    </LocalizationProvider >
  );
}
