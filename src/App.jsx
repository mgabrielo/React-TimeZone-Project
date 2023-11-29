import "./App.css";
import { useEffect } from "react";
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
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { format, utcToZonedTime, toDate } from "date-fns-tz";
import { Disclosure } from "@headlessui/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function App() {
  const dispatch = useDispatch();

  const {
    allTImeZones,
    allTimeZonesLoading,
    allTImeZonesError,
    timezoneArea,
    timezoneAreaLoading,
    timezoneAreaError,
  } = useSelector((state) => state.timezone);

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
      if (areaValue !== undefined) {
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

  const iconStyle = {
    fontSize: 17,
    color: "#9C27B0",
    display: "flex",
  };

  const fontStyle = {
    color: "#4A148C",
    fontWeight: 600,
    fontSize: 18,
  };

  const loadingBox = {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginY: 5,
  };

  return (
    <Container maxWidth="lg" className="App" sx={{ justifyContent: "center" }}>
      <Typography variant="h5" sx={{ padding: 2, color: "#4A148C" }}>
        Time Zone Selection
      </Typography>
      <div className="mx-auto w-full rounded-2xl bg-purple-50 p-2">
        {!allTimeZonesLoading ? (
          !allTImeZonesError && allTImeZones.length > 0 ? (
            allTImeZones.map((item, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      onClick={() => fetchArea(item)}
                      className="flex w-full z-50 justify-between items-center rounded-lg mb-1 bg-purple-100 px-4 py-2 text-left text-md font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                    >
                      <Typography>{item}</Typography>
                      {open && item === timezoneArea?.timezone ? (
                        <RemoveIcon sx={iconStyle} />
                      ) : (
                        <AddIcon sx={iconStyle} />
                      )}
                    </Disclosure.Button>
                    {!timezoneAreaLoading &&
                    timezoneArea &&
                    !timezoneAreaError ? (
                      open &&
                      item === timezoneArea?.timezone &&
                      timezoneArea?.datetime && (
                        <Disclosure.Panel className="px-4 py-4">
                          <Typography sx={fontStyle}>
                            {formatDateTime(timezoneArea)}
                          </Typography>
                        </Disclosure.Panel>
                      )
                    ) : (
                      <Typography sx={fontStyle}>
                        {timezoneAreaError}
                      </Typography>
                    )}
                  </>
                )}
              </Disclosure>
            ))
          ) : (
            <Typography sx={fontStyle}>{allTImeZonesError}</Typography>
          )
        ) : (
          <Box sx={loadingBox}>
            <CircularProgress disableShrink sx={{ color: "#4A148C", mb: 4 }} />
            <Typography sx={fontStyle}>Loading...Please Wait</Typography>
          </Box>
        )}
      </div>
    </Container>
  );
}

export default App;
