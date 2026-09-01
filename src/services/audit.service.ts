import { db } from "./db.service.js";

export interface CreateAuditLogParams {
  userId?: string;
  userName: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  public static async log(params: CreateAuditLogParams) {
    return db.logAudit(params);
  }

  public static async verifyChain() {
    return db.verifyAuditChain();
  }
}
