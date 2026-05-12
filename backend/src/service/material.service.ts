import { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { Material } from "../types/material";

export async function querySingleMaterial(
  connection: PoolConnection | Pool,
  id: string | number
): Promise<Material | null> {
  const [materials] = await connection.query<(Material & RowDataPacket)[]>(
    "SELECT * FROM material WHERE material_id = ?",
    [id]
  );

  if (materials.length === 0) {
    return null;
  }

  return materials[0];
}
