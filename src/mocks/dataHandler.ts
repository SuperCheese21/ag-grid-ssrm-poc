import { delay, HttpHandler, HttpResponse, http } from "msw";
import data from "./olympicWinners.json";

export const dataHandler: HttpHandler[] = [
  http.get("**/data*", async ({ request }) => {
    const url = new URL(request.url);
    try {
      const offset = url.searchParams.get("offset");
      const pageSize = url.searchParams.get("pageSize");
      const offsetValue = offset !== null ? parseInt(offset, 10) : 0;
      const pageSizeValue = pageSize !== null ? parseInt(pageSize, 10) : 100;
      const requestedRows = data.slice(
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
