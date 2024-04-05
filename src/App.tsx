import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { ApiResponse, IOlympicData } from "./types";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";

function App() {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const columnDefs = useMemo<ColDef<IOlympicData>[]>(
    () => [
      { field: "athlete", minWidth: 220 },
      { field: "country", minWidth: 200 },
      { field: "year" },
      { field: "sport", minWidth: 200 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: false,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz-dark"}>
        <AgGridReact<IOlympicData>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="serverSide"
          serverSideDatasource={{
            getRows: ({ request, success, fail }) => {
              const queryString = new URLSearchParams({
                offset: request.startRow?.toString() ?? "0",
                pageSize: "100",
              });
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
