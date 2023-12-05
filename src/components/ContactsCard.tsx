"use client";
import { ContactType } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmailIcon from "@mui/icons-material/Email";
import HouseIcon from "@mui/icons-material/House";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnassign = async () => {
    await getData("/leads/rotate", HttpMethod.POST, {
      lead_phone: phone,
    });
    handleClose();
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        width: 320,
        maxWidth: "100%",
        height: 270,
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
            {contactType === ContactType.LEAD ? (
              <Chip label="Lead" color="warning" size="small" />
            ) : contactType === ContactType.COMPANY ? (
              <Chip label="Company" color="primary" size="small" />
            ) : contactType === ContactType.SALES ? (
              <Chip label="Sales" color="success" size="small" />
            ) : null}
          </Box>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
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
            {contactType == ContactType.LEAD && <MenuItem>Assign</MenuItem>}
            {contactType == ContactType.LEAD && (
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
        </Box>
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
