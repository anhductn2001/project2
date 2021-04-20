import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";

class RCSTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, head, body, emptyText } = this.props;
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>{head(TableCell)}</TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0
              ? data.map((d, index) => (
                  <TableRow key={index}>{body(d, TableCell)}</TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        {data.length == 0 ? (
          <Typography variant="body1">{emptyText}</Typography>
        ) : null}
      </React.Fragment>
    );
  }
}

export default RCSTable;
