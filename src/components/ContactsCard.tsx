"use client";
import { components } from "@/interfaces/db_interfaces";
import {
  AccountStatus,
  ContactType,
  CreateType,
  LeadStatus,
  LeadType,
} from "@/interfaces/enums";
import { AdminOwner, AdminOwnerTeamLeader } from "@/interfaces/scopes";
import { HttpMethod, getData, getUser } from "@/utils/api";
import { Create, Delete } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BadgeIcon from "@mui/icons-material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import DomainIcon from "@mui/icons-material/Domain";
import EmailIcon from "@mui/icons-material/Email";
import HouseIcon from "@mui/icons-material/House";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import {
  CardHeader,
  CircularProgress,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
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
  area?: string;
  jobTitle?: string;
  budgetRange?: string;
  contactType: ContactType;
  assignedTo?: number;
  assignedToName?: string;
  project?: string;
  leadType?: LeadType;
  employees?: components["schemas"]["Employee"][];
  leadStatus?: LeadStatus;
  accountStatus?: AccountStatus;
  reload?: boolean;
  setReload?: React.Dispatch<React.SetStateAction<boolean>>;
  parentLoading?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  name,
  email,
  phone,
  area,
  project,
  jobTitle,
  areaType,
  budgetRange,
  contactType,
  assignedTo,
  assignedToName,
  employees,
  leadType,
  leadStatus,
  accountStatus,
  reload,
  setReload,
  parentLoading,
}) => {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [assignedSelected, setAssignedSelected] = React.useState<number>();

  const [statusChangeOpen, setStatusChangeOpen] = React.useState(false);
  const [status, setStatus] = React.useState<AccountStatus>();
  const [user, setUser] = React.useState<components["schemas"]["Employee"]>();

  const [loading, setLoading] = React.useState<boolean>(false);
  const createType = leadType
    ? leadType === LeadType.CAMPAIGN
      ? CreateType.CAMPAIGN
      : CreateType.COLD_CALL
    : CreateType.PERSONAL;
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
    if (loading) return;
    setAssignOpen(false);
    setAssignedSelected(assignedTo);
  };

  const handleStausChangeClose = () => {
    if (loading) return;
    setStatusChangeOpen(false);
    setStatus(accountStatus);
  };

  const handleAssign = async (event: any) => {
    try {
      setLoading(true);
      await getData("/leads/rotate", HttpMethod.POST, {
        lead_phone: phone,
        to: assignedSelected,
      });
    } finally {
      setLoading(false);
      handleAssignClose();
    }

    if (reload !== undefined && setReload !== undefined) {
      setReload(!reload);
    } else {
      window.location.reload();
    }
  };

  const handleUnassign = async () => {
    await getData("/leads/rotate", HttpMethod.POST, {
      lead_phone: phone,
    });
    handleMenuClose();
    if (reload !== undefined && setReload !== undefined) {
      setReload(!reload);
    } else {
      window.location.reload();
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
    handleStausChangeClose();

    if (reload !== undefined && setReload !== undefined) {
      setReload(!reload);
    } else {
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    try {
      if (contactType === ContactType.LEAD) {
        await getData("/leads/", HttpMethod.DELETE, {
          phone: phone,
        });
      } else if (contactType === ContactType.COMPANY) {
        await getData("/accounts/company", HttpMethod.DELETE, {
          phone: phone,
          assigned_to: assignedTo,
        });
      } else if (contactType === ContactType.SALES) {
        await getData("/accounts/sales", HttpMethod.DELETE, {
          phone: phone,
          assigned_to: assignedTo,
        });
      }
    } finally {
      handleMenuClose();
      if (reload !== undefined && setReload !== undefined) {
        setReload(!reload);
      } else {
        window.location.reload();
      }
    }
  };

  const calculateMiddlePosition = () => {
    const middleX = window.innerWidth / 2;
    const middleY = window.innerHeight / 2;
    return { top: middleY, left: middleX };
  };
  const cardHeight = AdminOwnerTeamLeader.includes(user?.position.id as number)
    ? 320
    : 290;
  React.useEffect(() => {
    const fetchFirstData = async () => {
      const user = await getUser();

      if (accountStatus) setStatus(accountStatus);
      if (assignedTo) setAssignedSelected(assignedTo);
      setUser(user);
    };

    fetchFirstData();
  }, []);

  return (
    <Card
      raised
      sx={{
        marginBottom: 2,
        width: 320,
        maxWidth: "100%",
        height: cardHeight,
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        action={
          (contactType !== ContactType.LEAD ||
            AdminOwnerTeamLeader.includes(user?.position.id as number)) && (
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={name}
        subheader={jobTitle}
        sx={{ paddingBottom: 0 }}
      />
      <CardContent sx={{ paddingBottom: 0, paddingTop: 1 }}>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          {/* Add menu items as needed */}
          {contactType !== ContactType.LEAD && (
            <MenuItem>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                href={{
                  pathname: "/actions/add",
                  query: {
                    name: name,
                    phone: phone,
                    assignedTo: assignedTo,
                    accountType: createType,
                  },
                }}
              >
                Add action
              </Link>
            </MenuItem>
          )}
          {contactType !== ContactType.LEAD && (
            <MenuItem
              disabled={parentLoading}
              onClick={handleStatusChangeClick}
            >
              Change status
            </MenuItem>
          )}
          {AdminOwnerTeamLeader.includes(user?.position.id as number) &&
            (contactType === ContactType.LEAD ||
              contactType === ContactType.COMPANY) && (
              <MenuItem disabled={parentLoading} onClick={handleAssignClick}>
                {leadStatus === LeadStatus.NOT_ASSIGNED ? "Assign" : "Rotate"}
              </MenuItem>
            )}
          {AdminOwnerTeamLeader.includes(user?.position.id as number) &&
            (contactType === ContactType.LEAD ||
              contactType === ContactType.COMPANY) &&
            leadStatus !== LeadStatus.NOT_ASSIGNED && (
              <MenuItem disabled={parentLoading} onClick={handleUnassign}>
                Unassign
              </MenuItem>
            )}
          {(contactType === ContactType.SALES ||
            AdminOwnerTeamLeader.includes(user?.position.id as number)) && (
            <MenuItem disabled={parentLoading} onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )}
        </Menu>
        {/* Chips (can wrap below the name and job title) */}
        {contactType === ContactType.COMPANY ? (
          leadType === LeadType.CAMPAIGN ? (
            <Chip label="Campaign" color="primary" size="small" />
          ) : (
            <Chip label="Cold Call" color="secondary" size="small" />
          )
        ) : contactType === ContactType.SALES ? (
          <Chip label="Personal" color="success" size="small" />
        ) : (
          contactType === ContactType.LEAD && (
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
          )
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
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
          {project && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DomainIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{project}</Typography>
            </Box>
          )}
          {area && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PlaceIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{area}</Typography>
            </Box>
          )}
          {budgetRange && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{budgetRange}</Typography>
            </Box>
          )}
          {AdminOwnerTeamLeader.includes(user?.position.id as number) &&
            assignedToName && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BadgeIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{assignedToName}</Typography>
              </Box>
            )}
        </Box>
        <Popover
          open={assignOpen}
          onClose={handleAssignClose}
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
          <Card raised>
            {!loading ? (
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
            ) : (
              <CardContent
                sx={{ justifyContent: "center", textAlign: "center" }}
              >
                <CircularProgress />
              </CardContent>
            )}
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                disabled={loading}
                variant="contained"
                onClick={handleAssign}
              >
                Assign
              </Button>
              <Button
                disabled={loading}
                variant="outlined"
                onClick={handleAssignClose}
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Popover>
        <Popover
          open={statusChangeOpen}
          onClose={handleStausChangeClose}
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
          <Card raised>
            {!loading ? (
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
            ) : (
              <CardContent
                sx={{ justifyContent: "center", textAlign: "center" }}
              >
                <CircularProgress />
              </CardContent>
            )}
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                disabled={loading}
                variant="contained"
                onClick={handleStatusChange}
              >
                Change
              </Button>
              <Button
                disabled={loading}
                variant="outlined"
                onClick={handleStausChangeClose}
              >
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
            disabled={parentLoading}
          >
            WhatsApp
          </Button>
          {contactType === ContactType.LEAD ? (
            <Link
              href={{
                pathname: "/leads/view",
                query: {
                  phone: phone,
                },
              }}
            >
              <Button disabled={parentLoading} sx={{ flex: "1 1 0" }}>
                View
              </Button>
            </Link>
          ) : (
            <Link
              href={{
                pathname: "/accounts/view",
                query: {
                  phone: phone,
                  assignedTo: assignedTo,
                  type: contactType,
                },
              }}
            >
              <Button disabled={parentLoading} sx={{ flex: "1 1 0" }}>
                View
              </Button>
            </Link>
          )}
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default ContactCard;
