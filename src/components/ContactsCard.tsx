"use client";
import { components } from "@/interfaces/db_interfaces";
import { AccountStatus, ContactType, LeadStatus } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmailIcon from "@mui/icons-material/Email";
import HouseIcon from "@mui/icons-material/House";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";
interface ContactCardProps {
  name: string;
  phone: string;
  email?: string;
  areaType?: string;
  jobTitle?: string;
  budgetRange?: string;
  contactType: ContactType;
  assignedTo?: number;
  assignedToName?: string;
  employees?: components["schemas"]["Employee"][];
  leadStatus?: LeadStatus;
}

const ContactCard: React.FC<ContactCardProps> = ({
  name,
  email,
  phone,
  jobTitle,
  areaType,
  budgetRange,
  contactType,
  assignedTo,
  assignedToName,
  employees,
  leadStatus,
}) => {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [assignedSelected, setAssignedSelected] = React.useState<number>();

  const [statusChangeOpen, setStatusChangeOpen] = React.useState(false);
  const [status, setStatus] = React.useState<AccountStatus>();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleAssignClick = (event: React.MouseEvent<HTMLElement>) => {
    handleMenuClose();
    setAssignOpen(true);
  };

  const handleStatusChangeClick = (event: React.MouseEvent<HTMLElement>) => {
    handleMenuClose();
    setStatusChangeOpen(true);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);

    // handleAssignClose();
  };

  const handleAssignClose = () => {
    setAssignOpen(false);
  };

  const handleStausChangeClose = () => {
    setStatusChangeOpen(false);
  };

  const handleAssign = async (event: any) => {
    await getData("/leads/rotate", HttpMethod.POST, {
      lead_phone: phone,
      to: assignedSelected,
    });
    handleAssignClose();
    window.location.reload();
  };

  const handleUnassign = async () => {
    await getData("/leads/rotate", HttpMethod.POST, {
      lead_phone: phone,
    });
    handleMenuClose();
    window.location.reload();
  };

  const handleStatusChange = async () => {
    if (status) {
      if (contactType == ContactType.SALES) {
        await getData("/accounts/sales/status", HttpMethod.PUT, {
          assigned_to: assignedTo,
          phone: phone,
          status_id: status,
        });
      } else if (contactType == ContactType.COMPANY) {
        await getData("/accounts/company/status", HttpMethod.PUT, {
          phone: phone,
          assigned_to: assignedTo,
          status_id: status,
        });
      }
    }
    handleStausChangeClose();
    window.location.reload();
  };

  const calculateMiddlePosition = () => {
    const middleX = window.innerWidth / 2;
    const middleY = window.innerHeight / 2;
    return { top: middleY, left: middleX };
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        width: 320,
        maxWidth: "100%",
        height: 305,
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            <Typography
              align="left"
              variant="h6"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
              }}
            >
              {name}
            </Typography>
            <Typography
              align="left"
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
              }}
            >
              {jobTitle}
            </Typography>
          </Box>
          <Box>
            {contactType === ContactType.COMPANY ? (
              <Chip label="Company" color="primary" size="small" />
            ) : contactType === ContactType.SALES ? (
              <Chip label="Sales" color="success" size="small" />
            ) : null}
            {contactType === ContactType.LEAD && (
              <Chip
                label={
                  leadStatus === LeadStatus.ASSIGNED
                    ? "Assigned"
                    : leadStatus === LeadStatus.NOT_ASSIGNED
                    ? "Not Assigned"
                    : "Action Taken"
                }
                color={
                  leadStatus === LeadStatus.ASSIGNED
                    ? "error"
                    : leadStatus === LeadStatus.NOT_ASSIGNED
                    ? "warning"
                    : "success"
                }
                size="small"
              />
            )}
          </Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {/* Add menu items as needed */}
            {contactType != ContactType.LEAD && (
              <MenuItem>
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  href={{
                    pathname: "/actions/add",
                    query: {
                      name: name,
                      phone: phone,
                      assignedTo: assignedTo,
                      accountType: contactType,
                    },
                  }}
                >
                  Add action
                </Link>
              </MenuItem>
            )}
            {contactType != ContactType.LEAD && (
              <MenuItem onClick={handleStatusChangeClick}>
                Change status
              </MenuItem>
            )}
            {contactType == ContactType.LEAD && (
              <MenuItem onClick={handleAssignClick}>
                {leadStatus == LeadStatus.NOT_ASSIGNED ? "Assign" : "Rotate"}
              </MenuItem>
            )}
            {contactType == ContactType.LEAD &&
              leadStatus != LeadStatus.NOT_ASSIGNED && (
                <MenuItem onClick={handleUnassign}>Unassign</MenuItem>
              )}
            {/* <MenuItem onClick={handleClose}>Option 2</MenuItem> */}
          </Menu>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
            mb: 0,
            flex: "1",
            width: "100%",
          }}
        >
          {/*<Divider variant='middle' sx={{ bgcolor: "#000000", borderRadius: 5 }} />*/}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">{phone}</Typography>
          </Box>
          {email && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{email}</Typography>
            </Box>
          )}
          {areaType && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HouseIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{areaType}</Typography>
            </Box>
          )}
          {budgetRange && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{budgetRange}</Typography>
            </Box>
          )}
          {assignedToName && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{assignedToName}</Typography>
            </Box>
          )}
        </Box>
        <Popover
          open={assignOpen}
          anchorReference="anchorPosition"
          anchorPosition={calculateMiddlePosition()}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <Card sx={{ elevation: 6 }}>
            <CardContent sx={{ justifyContent: "center" }}>
              <TextField
                value={assignedSelected}
                sx={{ width: 200 }}
                label="Assign To"
                onChange={(event) =>
                  setAssignedSelected(parseInt(event.target.value))
                }
                select
              >
                {employees?.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button variant="contained" onClick={handleAssign}>
                Assign
              </Button>
              <Button variant="outlined" onClick={handleAssignClose}>
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Popover>
        <Popover
          open={statusChangeOpen}
          anchorReference="anchorPosition"
          anchorPosition={calculateMiddlePosition()}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <Card sx={{ elevation: 6 }}>
            <CardContent sx={{ justifyContent: "center" }}>
              <TextField
                value={status}
                sx={{ width: 200 }}
                label="Status"
                onChange={(event) => setStatus(parseInt(event.target.value))}
                select
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
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button variant="contained" onClick={handleStatusChange}>
                Assign
              </Button>
              <Button variant="outlined" onClick={handleStausChangeClose}>
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Popover>
      </CardContent>

      <CardActions
        sx={{
          bgcolor: "background.level1",
          justifyContent: "center",
          mt: "auto",
        }}
      >
        <ButtonGroup variant="outlined" sx={{ width: "100%" }}>
          <Button
            sx={{ flex: "1 1 0" }}
            onClick={() => {
              window.open(`https://wa.me/${phone.substring(1)}`, "_blank");
            }}
          >
            WhatsApp
          </Button>
          <Button sx={{ flex: "1 1 0" }}>View</Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default ContactCard;
