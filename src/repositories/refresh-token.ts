import CrudRepo from "../utils/crudrepo";


export type RefreshToken = {
    id: number;
    token: string;
};

export default new CrudRepo<RefreshToken>("refresh_token");