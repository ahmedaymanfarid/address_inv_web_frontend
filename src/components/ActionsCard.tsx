import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function ActionsCard({
  time,
  name,
  phone,
}: {
  time: string;
  name?: string;
  phone?: string;
}) {
  return (
    <Card sx={{ width: 320, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {time}
        </Typography>
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
          {name && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{name}</Typography>
            </Box>
          )}
          {phone && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{phone}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
