import "./App.css";
import { Fragment, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  allTImeZonesFailure,
  allTImeZonesStart,
  allTImeZonesSuccess,
  timezoneAreaFailure,
  timezoneAreaStart,
  timezoneAreaSuccess,
} from "./redux/timezone/timezoneSlice";
import Container from "@mui/material/Container";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { format, utcToZonedTime, toDate } from "date-fns-tz";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  })
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function App() {
  const dispatch = useDispatch();

  const {
    allTImeZones,
    allTimeZonesLoading,
    timezoneAreaLoading,
    timezoneArea,
  } = useSelector((state) => state.timezone);

  const [expanded, setExpanded] = useState(null);

  const handleAccordionChange = (idx) => {
    setExpanded((prevExpanded) => (prevExpanded === idx ? null : idx));
  };

  useEffect(() => {
    const fetchTImezone = async () => {
      try {
        dispatch(allTImeZonesStart());
        await axios
          .get("https://worldtimeapi.org/api/timezone")
          .then((response) => {
            if (response?.data !== null) {
              dispatch(allTImeZonesSuccess(response?.data));
            }
          })
          .catch((err) => {
            dispatch(allTImeZonesFailure(err?.message));
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchTImezone();
  }, [dispatch]);

  const fetchArea = async (areaValue) => {
    try {
      if (areaValue !== undefined && areaValue.length > 3) {
        timezoneAreaStart();
        await axios
          .get(`https://worldtimeapi.org/api/timezone/${areaValue}`)
          .then((response) => {
            if (response.status === 200 && response.data !== undefined) {
              dispatch(timezoneAreaSuccess(response?.data));
            }
          })
          .catch((err) => {
            dispatch(timezoneAreaFailure(err?.message));
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateTime = (value) => {
    const parsedDate = toDate(value.datetime);
    const parsDate = utcToZonedTime(parsedDate, value.timezone);
    const formattedDate = format(parsDate, "EEEE do MMMM yyyy, hh:mm a", {
      timeZone: value.timezone,
    });
    return formattedDate;
  };

  return (
    <Container maxWidth="lg" className="App" sx={{ justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          marginY: 5,
          marginX: "auto",
        }}
      >
        <Typography variant="h4" sx={{ padding: 2, color: "#154360" }}>
          TimeZone Selection
        </Typography>
        {!allTimeZonesLoading && allTImeZones && allTImeZones.length > 0 ? (
          allTImeZones.map((item, index) => {
            if (item && item.length > 3) {
              return (
                <Fragment key={index}>
                  <Accordion
                    expanded={expanded === index ? true : false}
                    onChange={() => handleAccordionChange(index)}
                    sx={{ marginBottom: 0 }}
                  >
                    <AccordionSummary
                      onClick={() => fetchArea(item)}
                      expandIcon={
                        expanded === index ? (
                          <RemoveIcon
                            sx={{
                              fontSize: "0.9rem",
                              color: expanded === index ? "#fff" : "none",
                            }}
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: "0.9rem",
                              color: expanded === index ? "none" : "#2C3E50",
                            }}
                          />
                        )
                      }
                      sx={{
                        backgroundColor:
                          expanded === index ? "#85929E" : "#ccc",
                        color: expanded === index ? "#fff" : "#154360",
                      }}
                    >
                      <Typography>{item}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "90%",
                      }}
                    >
                      {!timezoneAreaLoading && timezoneArea ? (
                        expanded === index &&
                        item === timezoneArea?.timezone &&
                        timezoneArea?.datetime && (
                          <Box>
                            <Typography>
                              {formatDateTime(timezoneArea)}
                            </Typography>
                          </Box>
                        )
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            marginY: 5,
                          }}
                        >
                          <CircularProgress disableShrink color="inherit" />
                          <Typography sx={{ mt: 4 }}>
                            Loading Data...Please Wait
                          </Typography>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Fragment>
              );
            }
            return null;
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginY: 5,
            }}
          >
            <CircularProgress disableShrink color="inherit" />
            <Typography sx={{ mt: 4 }}>Loading...Please Wait</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
