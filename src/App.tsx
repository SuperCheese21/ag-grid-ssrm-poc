import { ColDef, FilterModel, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import debounce from "lodash.debounce";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { SEARCH_DEBOUNCE_TIME } from "./constants";
import { ApiResponse, IOlympicData, SortQueryParams } from "./types";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";

function App() {
  const [gridApi, setGridApi] = useState<GridApi<IOlympicData> | null>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const columnDefs = useMemo<ColDef<IOlympicData>[]>(
    () => [
      {
        field: "athlete",
        minWidth: 220,
        filter: "agTextColumnFilter",
      },
      {
        field: "country",
        minWidth: 200,
      },
      { field: "year" },
      { field: "sport", minWidth: 200 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const onInputChange = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      const filterInstance = await gridApi?.getColumnFilterInstance("athlete");
      filterInstance?.setModel({
        type: "contains",
        filter: target.value,
      });
      gridApi?.onFilterChanged();
    },
    [gridApi]
  );

  const debouncedInputChange = useMemo(
    () => debounce(onInputChange, SEARCH_DEBOUNCE_TIME),
    [onInputChange]
  );

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", margin: "10px" }}>
        <input onChange={debouncedInputChange} style={{ width: "200px" }} />
      </div>
      <div style={gridStyle} className={"ag-theme-quartz-dark"}>
        <AgGridReact<IOlympicData>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="serverSide"
          onGridReady={({ api }) => {
            setGridApi(api);
          }}
          serverSideDatasource={{
            getRows: ({ request, success, fail }) => {
              const filterModel = request.filterModel as FilterModel;
              const sortParams = request.sortModel.reduce<SortQueryParams>(
                (acc, { sort, colId }) => ({
                  ...acc,
                  [colId]: sort,
                }),
                {}
              );
              const queryString = new URLSearchParams({
                offset: request.startRow?.toString() ?? "0",
                pageSize: "100",
                ...sortParams,
              });
              if (filterModel.athlete) {
                queryString.set("athleteFilter", filterModel.athlete.filter);
              }
              fetch(`/data?${queryString.toString()}`, {
                method: "get",
              })
                .then((response) => {
                  response
                    .json()
                    .then((json: ApiResponse) =>
                      success({ rowData: json.rows })
                    )
                    .catch(() => fail());
                })
                .catch(() => fail());
            },
          }}
          cacheBlockSize={100}
          maxBlocksInCache={100}
          maxConcurrentDatasourceRequests={2}
          blockLoadDebounceMillis={0}
          purgeClosedRowNodes={false}
          serverSidePivotResultFieldSeparator="_"
          serverSideSortAllLevels={false}
          serverSideEnableClientSideSort={false}
          serverSideOnlyRefreshFilteredGroups={false}
          serverSideInitialRowCount={1}
        />
      </div>
    </div>
  );
}

export default App;
