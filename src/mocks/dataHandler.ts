import { delay, HttpHandler, HttpResponse, http } from "msw";
import { SORT_KEYS } from "../constants";
import { IOlympicData } from "../types";
import data from "./olympicWinners.json";

export const dataHandler: HttpHandler[] = [
  http.get("**/data*", async ({ request }) => {
    const url = new URL(request.url);
    const rowData = data as IOlympicData[];
    try {
      const offset = url.searchParams.get("offset");
      const pageSize = url.searchParams.get("pageSize");
      const sortKey = SORT_KEYS.find((key) => url.searchParams.get(key));
      const sortValue = sortKey ? url.searchParams.get(sortKey) : "asc";
      const offsetValue = offset !== null ? parseInt(offset, 10) : 0;
      const pageSizeValue = pageSize !== null ? parseInt(pageSize, 10) : 100;
      const athleteFilter = url.searchParams.get("athleteFilter");
      const filteredRows = athleteFilter
        ? rowData.filter(({ athlete }) =>
            athlete.toLowerCase().includes(athleteFilter.toLowerCase())
          )
        : rowData;
      const sortedRows = sortKey
        ? filteredRows.sort((a, b) => {
            if (a[sortKey] > b[sortKey]) {
              return sortValue === "asc" ? 1 : -1;
            }
            if (b[sortKey] > a[sortKey]) {
              return sortValue === "asc" ? -1 : 1;
            }
            return 0;
          })
        : filteredRows;
      const requestedRows = sortedRows.slice(
        offsetValue,
        offsetValue + pageSizeValue
      );
      await delay(1000);
      return HttpResponse.json({
        success: true,
        rows: requestedRows,
      });
    } catch (err) {
      return HttpResponse.error();
    }
  }),
];
