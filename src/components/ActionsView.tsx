import { components } from "@/interfaces/db_interfaces";
import { ActionType, ContactType } from "@/interfaces/enums";
import { HttpMethod, getData } from "@/utils/api";
import { formatReadableDate } from "@/utils/format";
import AlarmIcon from "@mui/icons-material/Alarm";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HistoryIcon from "@mui/icons-material/History";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import React from "react";
import ActionsCard from "./ActionsCard";

export default function ActionsView({
  type,
  phone,
  assignedTo,
}: {
  type: ContactType;
  phone: string;
  assignedTo?: number;
}) {
  const [actionsLoading, setActionsLoading] = React.useState<boolean>(true);
  const [actionsReload, setActionsReload] = React.useState<boolean>(false);
  const [lastAction, setLastAction] =
    React.useState<components["schemas"]["CompanyAction"]>();
  const [lastActionType, setLastActionType] = React.useState<ActionType>();
  const [nextAction, setNextAction] =
    React.useState<components["schemas"]["CompanyAction"]>();
  const [nextActionType, setNextActionType] = React.useState<ActionType>();
  const endpoint =
    type === ContactType.SALES ? "/accounts/sales/actions/" : "/leads/actions/";

  const params =
    type === ContactType.SALES
      ? {
          phone: phone,
          assigned_to: assignedTo,
        }
      : {
          phone: phone,
        };

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const delayedFetch = debounce(() => {
      const fetchData = async () => {
        try {
          // fetch data here
          setActionsLoading(true);
          const actionsData = await getData(
            endpoint,
            HttpMethod.GET,
            params,
            undefined,
            undefined,
            signal
          );

          const today = new Date();

          const pastCalls = actionsData.calls.filter(
            (event: any) => new Date(event.date) < today
          );

          const futureCalls = actionsData.calls.filter(
            (event: any) => new Date(event.date) >= today
          );

          const pastMeetings = actionsData.meetings.filter(
            (event: any) => new Date(event.date) < today
          );

          const futureMeetings = actionsData.meetings.filter(
            (event: any) => new Date(event.date) >= today
          );

          let lastAction;
          let nextAction;
          let lastActionType;
          let nextActionType;

          // Find the most recent past action
          const pastActions = [...pastCalls, ...pastMeetings];
          if (pastActions.length > 0) {
            lastAction = pastActions.reduce((prev, current) =>
              new Date(prev.date) > new Date(current.date) ? prev : current
            );
            lastActionType = pastCalls.includes(lastAction)
              ? ActionType.CALL
              : ActionType.MEETING;
          }

          // Find the most next action
          const futureActions = [...futureCalls, ...futureMeetings];
          if (futureActions.length > 0) {
            nextAction = futureActions.reduce((prev, current) =>
              new Date(prev.date) < new Date(current.date) ? prev : current
            );
            nextActionType = futureCalls.includes(nextAction)
              ? ActionType.CALL
              : ActionType.MEETING;
          }
          // Now you can set your state variables
          setLastAction(lastAction);
          setNextAction(nextAction);
          setLastActionType(lastActionType);
          setNextActionType(nextActionType);
        } catch (error) {
          // Handle errors
        } finally {
          setActionsLoading(false);
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
  }, [actionsReload]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <HistoryIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Last Action</Typography>
      </Box>
      {actionsLoading ? (
        <LinearProgress sx={{ my: 2 }} />
      ) : (
        <Divider sx={{ my: 2 }} />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
        }}
      >
        {lastAction ? (
          <ActionsCard
            time={new Date(
              lastAction?.date ? lastAction?.date : new Date()
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
            assignedToName={lastAction.assigned_to.name}
            date={formatReadableDate(dayjs(lastAction?.date))}
            actionType={lastActionType}
          />
        ) : (
          // <Typography variant="h6">No Actions</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
            <Typography color="text.secondary" variant="h5">
              Empty
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <AlarmIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Next Follow Up</Typography>
      </Box>
      {actionsLoading ? (
        <LinearProgress sx={{ mb: 2 }} />
      ) : (
        <Divider sx={{ my: 2 }} />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
        }}
      >
        {nextAction ? (
          <ActionsCard
            time={new Date(
              nextAction?.date ? nextAction?.date : new Date()
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
            assignedToName={nextAction.assigned_to.name}
            date={formatReadableDate(dayjs(nextAction?.date))}
            actionType={nextActionType}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <DoNotDisturbIcon color="action" sx={{ mr: 1 }} />
            <Typography color="text.secondary" variant="h5">
              Empty
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
