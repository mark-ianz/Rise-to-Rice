import { RowDataPacket } from "mysql2";
import pool from "../connection/database";

export async function checkForPagination(
  page: string,
  limit: string,
  table: string,
  table_id: string,
  whereClause?: {
    statement: string;
    values: (string | number)[];
  },
  joins?: string
) {
  // page - is the page number
  // limit - is the number of items per page
  // table - is the name of the table, this will be used for counting the total number of items in the table
  // table_id - is the primary key of the table to optimize the use of COUNT() function

  const defaultPage = 1;
  const defaultLimit = 25;

  try {
    const pageInt = parseInt(page) || defaultPage;
    const limitInt = parseInt(limit) || defaultLimit;

    const values =
      whereClause && (whereClause.values.length > 0 ? whereClause.values : []);
    const statement = whereClause?.statement ? `${whereClause.statement}` : "";
    const query = `SELECT COUNT(${table_id}) as total_items FROM ${table} ${joins ? joins : ""} ${statement}`;

    const [[{ total_items }]] = await pool.query<
      ({ total_items: number } & RowDataPacket)[]
    >(query, values);

    const offset = (pageInt - 1) * limitInt;
    const hasNext = total_items > offset + limitInt;
    const hasPrev = pageInt > 1;

    // limitInt - same as limit but parsed to int
    // pageInt - same as page but parsed to int
    // offset - the starting index of the items to be fetched
    // total_items - the total number of items in the table
    // hasNext - a boolean value if there are still items to be fetched after the current page
    // hasPrev - a boolean value if there are still items to be fetched before the current page
    return { limitInt, offset, pageInt, total_items, hasNext, hasPrev };
  } catch (error) {
    console.log(error);
    return null;
  }
}
