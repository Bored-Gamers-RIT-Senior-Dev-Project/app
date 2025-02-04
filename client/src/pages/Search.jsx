import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { usePostSubmit } from "../hooks/usePostSubmit";

const Search = () => {
  const [searchBar, setSearchBar] = useState("");
  const submit = usePostSubmit();

  return (
    <Box width="100%">
      <Typography variant="h1">Search</Typography>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={searchBar}
        onChange={(event) => setSearchBar(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && submit({ searchBar })}
      />
      <Button onClick={() => submit({ searchBar })}>Search</Button>
    </Box>
  );
};
export { Search };
