import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";

const LoadingSpinner = ({ size = "3x" }: { size?: SizeProp }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <FontAwesomeIcon icon={faSpinner} pulse size={size} />
    </Box>
  );
};

export default LoadingSpinner;
