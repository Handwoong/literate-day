import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import { styled, createTheme, ThemeProvider } from "@mui/system";
import { palette } from "@mui/system";
import { cyan } from "@mui/material/colors";

function Loading() {
  const one = cyan[50];
  const two = cyan[100];
  const three = cyan[200];
  const four = cyan[300];
  return (
    <Stack
      direction="row"
      spacing={5}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "auto",
        height: 400,
      }}
    >
      {/* <Skeleton variant="text" /> */}
      <Skeleton
        variant="circular"
        sx={{ bgcolor: one, width: 40, height: 40 }}
      />
      <Skeleton
        variant="circular"
        sx={{ bgcolor: two, width: 40, height: 40 }}
      />
      <Skeleton
        variant="circular"
        sx={{ bgcolor: three, width: 40, height: 40 }}
      />
      <Skeleton
        variant="circular"
        sx={{ bgcolor: four, width: 40, height: 40 }}
      />

      {/* <Skeleton variant="rectangular" width={210} height={118} /> */}
    </Stack>
    // <Box sx={{ width: 100 }}>
    //   <Skeleton />
    //   <Skeleton animation="wave" />
    //   <Skeleton animation={false} />
    // </Box>
  );
}
export default Loading;
