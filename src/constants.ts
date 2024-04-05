import { IOlympicData } from "./types";

export const AG_GRID_LICENSE =
  "Using_this_AG_Grid_Enterprise_key_( AG-045300 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( CDK Global, LLC )_is_granted_a_( Multiple Applications )_Developer_License_for_( 24 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_( 4 )_Production_Environments___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 31 October 2024 )____[v2]_MTczMDMzMjgwMDAwMA==2785c7e6039d9f7ad5d800e0c401e3ee";

export const SORT_KEYS = [
  "athlete",
  "country",
  "year",
  "sport",
  "gold",
  "silver",
  "bronze",
] as Array<keyof IOlympicData>;

export const SEARCH_DEBOUNCE_TIME = 400;
