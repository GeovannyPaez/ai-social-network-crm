import { styled } from "@mui/system";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";

const CustomTableCell = styled(TableCell)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const TableRowSkeleton = ({ avatar, columns }) => {
  return (
    <>
      <TableRow>
        {avatar && (
          <>
            <CustomTableCell style={{ paddingRight: 0 }}>
              <Skeleton animation="wave" variant="circular" width={40} height={40} />
            </CustomTableCell>
            <TableCell>
              <Skeleton animation="wave" height={30} width={80} />
            </TableCell>
          </>
        )}
        {Array.from({ length: columns }, (_, index) => (
          <CustomTableCell align="center" key={index}>
            <Skeleton align="center" animation="wave" height={30} width={80} />
          </CustomTableCell>
        ))}
      </TableRow>
    </>
  );
};

export default TableRowSkeleton;
