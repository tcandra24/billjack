import axios from "axios";
export default axios.create({
  baseURL: "https://testpostpaid.mobilepulsa.net/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});
//  https://mobilepulsa.net/api/v1
