import { Knex } from "knex";
import db from "../config/db";
import InternalServerError from "../exceptions/InternalServerError";


type QueryModifiers<T> = {
    offset?: number,
    limit?: number,
    cols?: string,

    order?: "desc" | "asc",

    orderby?: keyof T;

} & {
    [K in keyof T]?: T[K] | T[K][];
};

export default class CrudRepo<T extends {}> {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }


    private omitQueryModifiers(query: QueryModifiers<Partial<T>>) {
        const { limit, offset, cols, order, orderby, ...filteredQuery } = query;
        return filteredQuery;
    }

    private async getTableCols(): Promise<string[]> {
        const columns = await db(this.tableName).columnInfo();
        return Object.keys(columns);
    }

    private async sanitizedCols(cols: string): Promise<string[]> {
        const allowedCols = await this.getTableCols();

        return cols.split(",").filter(col => allowedCols.includes(col.trim()));
    }

    async count(query: QueryModifiers<Partial<T>>) {
        const sql = db(this.tableName).count('*', { as: "count" });

        const filters = this.omitQueryModifiers(query);

        // Apply filters: handle array values using whereIn
        Object.entries(filters).forEach(([key, value]) => {
            let val = (<string>value).split(",");
            if (val.length > 1) {
                sql.whereIn(key, val);
            } else {
                sql.where(key, val[0]);
            }
        });
        return (await sql)[0].count;
    }

    async find(query: QueryModifiers<Partial<T>>): Promise<T[]> {
        try {
            const sql = db(this.tableName);

            if (!query.limit || query.limit < 0)
                query.limit = 10;

            if (query.cols)
                sql.select(await this.sanitizedCols(query.cols));

            sql.limit(query.limit);

            if (query.offset)
                sql.offset(query.offset);

            if (query.order || query.orderby)
                sql.orderBy(query.orderby ?? "id", query.order ?? "asc");

            const filters = this.omitQueryModifiers(query);

            // Apply filters: handle array values using whereIn
            Object.entries(filters).forEach(([key, value]) => {
                let val = (<string>value).split(",");
                if (val.length > 1) {
                    sql.whereIn(key, val);
                } else {
                    sql.where(key, val[0]);
                }
            });

            return await sql;
        } catch (error) {
            throw new InternalServerError("Invalid Query", error);
            
        }
    }

    async insert(data: Partial<T>, trx?: Knex.Transaction) {
        const query = db(this.tableName).insert(data);
        if (trx)
            query.transacting(trx);

        const result = await query;
        return result;
    }

    async batchInsert(data: any, trx?: Knex.Transaction) {
        const query = db.batchInsert(this.tableName, data, 50);

        if (trx)
            query.transacting(trx);

        const result = await query;
        return result;
    }

    async update(id: number | string, data: Partial<T>, trx?: Knex.Transaction) {
        const query = db(this.tableName).update(data).where("id", id);

        if (trx)
            query.transacting(trx);

        const result = await query;
        return result;
    }

    async remove(obj: Partial<T>, trx?: Knex.Transaction) {
        const query = db(this.tableName).where(obj).delete();

        if (trx)
            query.transacting(trx);

        const result = await query;
        return result;
    }
}