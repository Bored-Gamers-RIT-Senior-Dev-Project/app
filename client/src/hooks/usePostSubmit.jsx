import { useSubmit } from "react-router";

const usePostSubmit = () => {
  const submit = useSubmit();
  const postSubmit = (data, params) => {
    submit(data, { method: "post", encType: "application/json", ...params });
  };
  return postSubmit;
};
export { usePostSubmit };
