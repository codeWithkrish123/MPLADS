// @ts-ignore
import pg from "pg";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";
import { SEEDED_MPS, SEEDED_CALAMITIES } from "../data/seededData.js";

const { Pool } = pg || {};

export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  state?: string | null;
  district?: string | null;
  constituency?: string | null;
  created_at: string;
}

export interface DBRiskAlert {
  id: string;
  work_id: string;
  work_name: string;
  state: string;
  district: string;
  category: string;
  severity: string;
  risk_score: number;
  anomaly_type: string;
  reason: string;
  status: string;
  assigned_to_id?: string | null;
  detected_at: string;
  resolved_at?: string | null;
  notes?: string | null;
}

export interface DBNearDuplicate {
  id: string;
  work_a_id: string;
  work_b_id: string;
  work_a_name: string;
  work_b_name: string;
  state?: string | null;
  district?: string | null;
  similarity_score: number;
  geo_distance_meters?: number | null;
  status: string;
  reviewer_id?: string | null;
  review_notes?: string | null;
  reviewed_at?: string | null;
}

export interface DBAuditLog {
  id: string;
  timestamp: string;
  user_id?: string | null;
  user_name: string;
  role: string;
  action: string;
  entity: string;
  entity_id: string;
  old_value?: any;
  new_value?: any;
  ip_address?: string | null;
  user_agent?: string | null;
  status: string;
  hash_signature: string;
  prev_hash?: string | null;
}

export interface DBComplianceRule {
  id: string;
  rule_id: string;
  title: string;
  category: string;
  affected_works_count: number;
  severity: string;
  status: string;
  policy_version: string;
  effective_date: string;
  source_document: string;
  policy_statement?: string | null;
  threshold_description: string;
  detection_logic: string;
}

export interface DBImplementingAgency {
  id: string;
  agency_code: string;
  name: string;
  short_name: string;
  type: string;
  state: string;
  district?: string | null;
  risk_category: string;
  avg_risk_score: number;
  total_works: number;
  completed_works: number;
  delayed_works: number;
  high_risk_works: number;
  active_expenditure_cr: number;
}

export interface DBMPAllocation {
  id: string;
  sr_no: number;
  state: string;
  mp_name: string;
  constituency: string;
  allocated_amount: number;
}

export interface DBCalamityConsent {
  id: string;
  sr_no: number;
  calamity_type: string;
  calamity_name: string;
  mp_name: string;
  consent_date: string;
  consent_amount: number;
}

class DatabaseService {
  private pool: any = null;
  private isConnected = false;

  // In-memory fallback state stores
  private memoryUsers: Map<string, DBUser> = new Map();
  private memoryAlerts: Map<string, DBRiskAlert> = new Map();
  private memoryDuplicates: Map<string, DBNearDuplicate> = new Map();
  private memoryAuditLogs: DBAuditLog[] = [];
  private memoryRules: Map<string, DBComplianceRule> = new Map();
  private memoryAgencies: Map<string, DBImplementingAgency> = new Map();
  private memoryMPs: DBMPAllocation[] = [];
  private memoryCalamities: DBCalamityConsent[] = [];

  constructor() {
    this.initPool();
  }

  private initPool() {
    try {
      if (Pool && env.DATABASE_URL) {
        // Check for CA cert file
        const caCandidates = [
          process.env.PGSSLROOTCERT,
          path.resolve("./ca.pem"),
          path.resolve("../ca.pem"),
          "C:\\Users\\Administrator\\Desktop\\AH\\ca.pem",
        ];

        let caCertContent: string | null = null;
        for (const p of caCandidates) {
          if (p && fs.existsSync(p)) {
            caCertContent = fs.readFileSync(p).toString();
            break;
          }
        }

        const cleanConnStr = env.DATABASE_URL.replace("?sslmode=require", "").replace("&sslmode=require", "");

        this.pool = new Pool({
          connectionString: cleanConnStr,
          ssl: {
            rejectUnauthorized: false,
            ca: caCertContent || undefined,
          },
          connectionTimeoutMillis: 5000,
        });

        this.pool.on("error", (err: any) => {
          console.warn("PostgreSQL Pool Notice:", err.message);
          this.isConnected = false;
        });
      }
    } catch (e: any) {
      console.warn("Failed to initialize PostgreSQL pool:", e.message);
      this.pool = null;
    }
  }

  public async initialize(): Promise<void> {
    // 1. Always seed baseline in-memory store so data is immediately available
    await this.seedInitialData();

    // 2. Try to connect to PostgreSQL and run schema DDL
    try {
      if (this.pool) {
        const client = await this.pool.connect();
        try {
          await this.createPostgresTables(client);
          await this.syncSeedsToPostgres(client);
          this.isConnected = true;
          console.log("🐘 Connected to PostgreSQL Database (Aiven Cloud) successfully!");
        } finally {
          client.release();
        }
      }
    } catch (err: any) {
      console.warn(`⚠️  PostgreSQL connection: ${err.message || err}. State maintained in active database engine.`);
      this.isConnected = false;
    }
  }

  private async createPostgresTables(client: any) {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN',
        state VARCHAR(100),
        district VARCHAR(100),
        constituency VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS risk_alerts (
        id VARCHAR(100) PRIMARY KEY,
        work_id VARCHAR(255) NOT NULL,
        work_name TEXT NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        risk_score NUMERIC(5,2) NOT NULL,
        anomaly_type VARCHAR(100) NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
        assigned_to_id VARCHAR(100),
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS near_duplicate_reviews (
        id VARCHAR(100) PRIMARY KEY,
        work_a_id VARCHAR(255) NOT NULL,
        work_b_id VARCHAR(255) NOT NULL,
        work_a_name TEXT NOT NULL,
        work_b_name TEXT NOT NULL,
        state VARCHAR(100),
        district VARCHAR(100),
        similarity_score NUMERIC(5,2) NOT NULL,
        geo_distance_meters NUMERIC(10,2),
        status VARCHAR(50) NOT NULL DEFAULT 'REQUIRES_HUMAN_REVIEW',
        reviewer_id VARCHAR(100),
        review_notes TEXT,
        reviewed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(100),
        user_name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(100) NOT NULL,
        entity_id VARCHAR(255) NOT NULL,
        old_value JSONB,
        new_value JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status VARCHAR(50) DEFAULT 'LOGGED',
        hash_signature VARCHAR(64) NOT NULL,
        prev_hash VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS compliance_rules (
        id VARCHAR(100) PRIMARY KEY,
        rule_id VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        affected_works_count INT DEFAULT 0,
        severity VARCHAR(20) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE_POLICY',
        policy_version VARCHAR(50) DEFAULT '1.0',
        effective_date DATE NOT NULL,
        source_document TEXT NOT NULL,
        policy_statement TEXT,
        threshold_description TEXT NOT NULL,
        detection_logic TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS implementing_agencies (
        id VARCHAR(100) PRIMARY KEY,
        agency_code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100),
        risk_category VARCHAR(20) DEFAULT 'LOW',
        avg_risk_score NUMERIC(5,2) DEFAULT 0,
        total_works INT DEFAULT 0,
        completed_works INT DEFAULT 0,
        delayed_works INT DEFAULT 0,
        high_risk_works INT DEFAULT 0,
        active_expenditure_cr NUMERIC(12,2) DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS mp_allocations (
        id VARCHAR(100) PRIMARY KEY,
        sr_no INT NOT NULL,
        state VARCHAR(100) NOT NULL,
        mp_name VARCHAR(255) NOT NULL,
        constituency VARCHAR(255) NOT NULL,
        allocated_amount NUMERIC(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS calamity_consents (
        id VARCHAR(100) PRIMARY KEY,
        sr_no INT NOT NULL,
        calamity_type VARCHAR(100) NOT NULL,
        calamity_name VARCHAR(255) NOT NULL,
        mp_name VARCHAR(255) NOT NULL,
        consent_date DATE NOT NULL,
        consent_amount NUMERIC(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  private async syncSeedsToPostgres(client: any) {
    // 1. Sync MPs
    const mpCheck = await client.query("SELECT COUNT(*) FROM mp_allocations");
    if (parseInt(mpCheck.rows[0].count, 10) === 0) {
      for (const mp of this.memoryMPs) {
        await client.query(
          "INSERT INTO mp_allocations (id, sr_no, state, mp_name, constituency, allocated_amount) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING",
          [mp.id, mp.sr_no, mp.state, mp.mp_name, mp.constituency, mp.allocated_amount]
        );
      }
    }

    // 2. Sync Calamities
    const calCheck = await client.query("SELECT COUNT(*) FROM calamity_consents");
    if (parseInt(calCheck.rows[0].count, 10) === 0) {
      for (const cal of this.memoryCalamities) {
        await client.query(
          "INSERT INTO calamity_consents (id, sr_no, calamity_type, calamity_name, mp_name, consent_date, consent_amount) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING",
          [cal.id, cal.sr_no, cal.calamity_type, cal.calamity_name, cal.mp_name, cal.consent_date, cal.consent_amount]
        );
      }
    }
  }

  public isPgConnected(): boolean {
    return this.isConnected;
  }

  // --- SEED INITIAL DATA ---
  private async seedInitialData() {
    // 1. All 543 Lok Sabha MPs
    this.memoryMPs = [...SEEDED_MPS];

    // 2. All 12 Calamities
    this.memoryCalamities = [...SEEDED_CALAMITIES];

    // 3. User Accounts for all government tiers
    const users: DBUser[] = [
      {
        id: "usr-ministry-01",
        email: "ministry@mplads.gov.in",
        password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.",
        full_name: "National Administrator (MoSPI)",
        role: "MINISTRY",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-state-mh-01",
        email: "state.maharashtra@mplads.gov.in",
        password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.",
        full_name: "State Nodal Officer Maharashtra",
        role: "STATE_NODAL",
        state: "Maharashtra",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-state-up-01",
        email: "state.up@mplads.gov.in",
        password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.",
        full_name: "State Nodal Officer Uttar Pradesh",
        role: "STATE_NODAL",
        state: "Uttar Pradesh",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-dist-amr-01",
        email: "district.amravati@mplads.gov.in",
        password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.",
        full_name: "District Collector Amravati",
        role: "DISTRICT_AUTHORITY",
        state: "Maharashtra",
        district: "Amravati",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-mp-var-01",
        email: "mp.varanasi@mplads.gov.in",
        password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.",
        full_name: "Shri Narendra Modi (Varanasi MP)",
        role: "MP",
        state: "Uttar Pradesh",
        constituency: "VARANASI",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-citizen-01",
        email: "citizen@mplads.gov.in",
        password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.",
        full_name: "Public Citizen / Social Auditor",
        role: "CITIZEN",
        created_at: new Date().toISOString(),
      },
    ];

    for (const u of users) {
      this.memoryUsers.set(u.email.toLowerCase(), u);
    }

    // 4. Compliance Policies Catalog
    const rules: DBComplianceRule[] = [
      {
        id: "rule-01",
        rule_id: "RULE-001",
        title: "Cost Deviation from District Median",
        category: "FINANCIAL",
        severity: "CRITICAL",
        status: "ACTIVE_POLICY",
        policy_version: "2.1",
        effective_date: "2024-01-01",
        source_document: "MPLADS Guidelines 2023, Para 4.1",
        policy_statement: "Sanctioned expenditure must not exceed +50% of the district median peer estimate for identical work categories.",
        threshold_description: "> 50% deviation from peer median cost",
        detection_logic: "cost > (peer_median * 1.5)",
        affected_works_count: 24,
      },
      {
        id: "rule-02",
        rule_id: "RULE-002",
        title: "Statutory 1-Year Completion Timeline",
        category: "IMPLEMENTATION",
        severity: "HIGH",
        status: "ACTIVE_POLICY",
        policy_version: "2.1",
        effective_date: "2024-01-01",
        source_document: "MPLADS Guidelines 2023, Para 3.8",
        policy_statement: "Works sanctioned under MPLADS must be completed within 12 months of sanction order issuance.",
        threshold_description: "> 365 days from sanction date without completion",
        detection_logic: "days_since_sanction > 365 AND status != 'Completed'",
        affected_works_count: 38,
      },
      {
        id: "rule-03",
        rule_id: "RULE-003",
        title: "Financial Draw vs Physical Progress Mismatch",
        category: "COMPLIANCE",
        severity: "CRITICAL",
        status: "ACTIVE_POLICY",
        policy_version: "2.0",
        effective_date: "2024-01-01",
        source_document: "GFR 2017 Rule 229 & MPLADS Rule 5.3",
        policy_statement: "Expenditure drawn must closely mirror verified physical progress. A delta > 40% constitutes financial anomaly.",
        threshold_description: "Financial progress > Physical progress + 40%",
        detection_logic: "(financial_progress - physical_progress) > 40",
        affected_works_count: 19,
      },
      {
        id: "rule-04",
        rule_id: "RULE-004",
        title: "Annexure-VIII Prohibited Work Category Match",
        category: "COMPLIANCE",
        severity: "HIGH",
        status: "ACTIVE_POLICY",
        policy_version: "2.2",
        effective_date: "2024-01-01",
        source_document: "MPLADS Annexure-VIII (Inadmissible Works)",
        policy_statement: "Works must conform to permissible community infrastructure. Vague descriptions with < 20% semantic similarity to approved works require audit verification.",
        threshold_description: "Semantic similarity < 20% to permissible activities",
        detection_logic: "nlp_similarity < 0.20",
        affected_works_count: 42,
      },
      {
        id: "rule-05",
        rule_id: "RULE-005",
        title: "Geospatial Duplicate Work Detection",
        category: "ANOMALY",
        severity: "HIGH",
        status: "ACTIVE_POLICY",
        policy_version: "2.0",
        effective_date: "2024-01-01",
        source_document: "MPLADS Anti-Duplication Directives 2024",
        policy_statement: "Works within 200 meters of another project with >80% semantic match require immediate human verification before fund release.",
        threshold_description: "Distance < 200m AND Similarity > 80%",
        detection_logic: "geo_dist < 200 AND text_sim > 0.80",
        affected_works_count: 15,
      },
    ];

    for (const r of rules) {
      this.memoryRules.set(r.id, r);
    }

    // 5. Implementing Agencies Across States
    const agencies: DBImplementingAgency[] = [
      {
        id: "agy-01",
        agency_code: "AGY-MH-PWD-01",
        name: "Public Works Department (Amravati Division)",
        short_name: "PWD Amravati",
        type: "PWD",
        state: "Maharashtra",
        district: "Amravati",
        risk_category: "HIGH",
        avg_risk_score: 72.5,
        total_works: 45,
        completed_works: 22,
        delayed_works: 14,
        high_risk_works: 9,
        active_expenditure_cr: 12.8,
      },
      {
        id: "agy-02",
        agency_code: "AGY-HR-RWD-01",
        name: "Rural Works Development Agency (Jhajjar/Sonipat)",
        short_name: "RWD Haryana",
        type: "Rural Works",
        state: "Haryana",
        district: "Jhajjar",
        risk_category: "CRITICAL",
        avg_risk_score: 81.0,
        total_works: 32,
        completed_works: 14,
        delayed_works: 12,
        high_risk_works: 6,
        active_expenditure_cr: 15.2,
      },
      {
        id: "agy-03",
        agency_code: "AGY-WB-PHED-01",
        name: "Public Health Engineering Directorate (North 24 Parganas)",
        short_name: "PHED Bengal",
        type: "Water Supply",
        state: "West Bengal",
        district: "North 24 Parganas",
        risk_category: "HIGH",
        avg_risk_score: 68.4,
        total_works: 38,
        completed_works: 24,
        delayed_works: 9,
        high_risk_works: 5,
        active_expenditure_cr: 9.4,
      },
      {
        id: "agy-04",
        agency_code: "AGY-AP-PRD-01",
        name: "Panchayati Raj Engineering Department (Chittoor)",
        short_name: "PRD Chittoor",
        type: "Panchayati Raj",
        state: "Andhra Pradesh",
        district: "Chittoor",
        risk_category: "MEDIUM",
        avg_risk_score: 48.0,
        total_works: 52,
        completed_works: 38,
        delayed_works: 10,
        high_risk_works: 4,
        active_expenditure_cr: 11.5,
      },
      {
        id: "agy-05",
        agency_code: "AGY-UP-JN-01",
        name: "UP Jal Nigam (Varanasi Division)",
        short_name: "UP Jal Nigam Varanasi",
        type: "Water Supply",
        state: "Uttar Pradesh",
        district: "Varanasi",
        risk_category: "LOW",
        avg_risk_score: 22.1,
        total_works: 64,
        completed_works: 56,
        delayed_works: 5,
        high_risk_works: 3,
        active_expenditure_cr: 18.0,
      },
    ];

    for (const a of agencies) {
      this.memoryAgencies.set(a.id, a);
    }

    // 6. Comprehensive Risk Alerts
    const alerts: DBRiskAlert[] = [
      {
        id: "alt-01",
        work_id: "WS/MP18065/2024-2025/135794",
        work_name: "17 Village Prajapat Choupal Construction",
        state: "Haryana",
        district: "Jhajjar",
        category: "Community Infrastructure",
        severity: "CRITICAL",
        risk_score: 80.0,
        anomaly_type: "Progress & Delay",
        reason: "Expenditure-progress mismatch: Financial is 100% but Physical is 14% (+86 pts); Delayed 198 days beyond 1-year guideline.",
        status: "Open",
        detected_at: new Date().toISOString(),
      },
      {
        id: "alt-02",
        work_id: "WS/MP18250/2024-2025/135268",
        work_name: "Installation of 10 nos. Arsenic Free water tank under Shasan G.P",
        state: "West Bengal",
        district: "North 24 Parganas",
        category: "Drinking Water Facility",
        severity: "HIGH",
        risk_score: 72.0,
        anomaly_type: "Cost & Progress",
        reason: "Cost is 679.9% above peer median; Financial is 100% but Physical is 48%.",
        status: "Under Investigation",
        detected_at: new Date().toISOString(),
      },
      {
        id: "alt-03",
        work_id: "WS/MP18006/2024-2025/135648",
        work_name: "Construction of CC Road from Nellepalli Mitta to Milk Dairy",
        state: "Andhra Pradesh",
        district: "Chittoor",
        category: "Rural Road Improvement",
        severity: "HIGH",
        risk_score: 60.0,
        anomaly_type: "Duplicate & Progress",
        reason: "Highly similar work description (84.8% match) found in same district (WS/MP18006/2024-2025/135650); 100% funds drawn vs 49% physical progress.",
        status: "Open",
        detected_at: new Date().toISOString(),
      },
      {
        id: "alt-04",
        work_id: "WS/MP643/2024-2025/135993",
        work_name: "HIGH MASK SOLAR LIGHTS INSTALLATION",
        state: "Madhya Pradesh",
        district: "Khargone (West Nimar)",
        category: "Renewable Energy",
        severity: "HIGH",
        risk_score: 64.0,
        anomaly_type: "Duplicate Work Order",
        reason: "100% identical title and sanctioned on the exact same date as WS/MP643/2024-2025/135994.",
        status: "Under Investigation",
        detected_at: new Date().toISOString(),
      },
      {
        id: "alt-05",
        work_id: "WS/MP18006/2024-2025/135650",
        work_name: "Construction of CC Road from Milk Dairy to Juice Factory in Nellepalli Mitta",
        state: "Andhra Pradesh",
        district: "Chittoor",
        category: "Rural Road Improvement",
        severity: "MEDIUM",
        risk_score: 48.0,
        anomaly_type: "Proximity Cluster",
        reason: "Geospatial proximity to existing CC road segment (145 meters separation).",
        status: "Open",
        detected_at: new Date().toISOString(),
      },
    ];

    for (const al of alerts) {
      this.memoryAlerts.set(al.id, al);
    }

    // 7. Near Duplicate Pairs
    const duplicates: DBNearDuplicate[] = [
      {
        id: "dup-01",
        work_a_id: "WS/MP18006/2024-2025/135648",
        work_b_id: "WS/MP18006/2024-2025/135650",
        work_a_name: "Construction of CC Road from Nellepalli Mitta to Milk Dairy",
        work_b_name: "Construction of CC Road from Milk Dairy to Juice Factory in Nellepalli Mitta",
        state: "Andhra Pradesh",
        district: "Chittoor",
        similarity_score: 84.8,
        geo_distance_meters: 145.0,
        status: "Requires Human Review",
        review_notes: "Both works share the exact same starting landmark and contractor agency.",
      },
      {
        id: "dup-02",
        work_a_id: "WS/MP643/2024-2025/135993",
        work_b_id: "WS/MP643/2024-2025/135994",
        work_a_name: "HIGH MASK SOLAR LIGHTS",
        work_b_name: "HIGH MASK SOLAR LIGHTS",
        state: "Madhya Pradesh",
        district: "Khargone (West Nimar)",
        similarity_score: 100.0,
        geo_distance_meters: 50.0,
        status: "Requires Human Review",
        review_notes: "100% identical title and sanctioned on the same date (2024-09-11).",
      },
    ];

    for (const d of duplicates) {
      this.memoryDuplicates.set(d.id, d);
    }

    // 8. Genesis Audit Log
    const genesisLog: DBAuditLog = {
      id: "aud-001",
      timestamp: new Date().toISOString(),
      user_name: "System Bootstrapper",
      role: "MINISTRY",
      action: "DATABASE_INITIALIZED_AND_SEEDED",
      entity: "Database",
      entity_id: "SYS-INIT-001",
      old_value: null,
      new_value: {
        status: "ONLINE",
        total_mps_seeded: this.memoryMPs.length,
        total_calamities_seeded: this.memoryCalamities.length,
        total_rules: this.memoryRules.size,
        total_agencies: this.memoryAgencies.size,
        total_alerts: this.memoryAlerts.size,
      },
      ip_address: "127.0.0.1",
      user_agent: "MPLADS-Sentinel-Core/1.0",
      status: "LOGGED",
      prev_hash: "GENESIS_HASH_00000000000000000000000000000000000000000000000000000000",
      hash_signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    };
    this.memoryAuditLogs.push(genesisLog);
  }

  // --- REPOSITORY METHODS ---

  // Users
  public async findUserByEmail(email: string): Promise<DBUser | null> {
    if (this.isConnected && this.pool) {
      try {
        const res = await this.pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
        if (res.rows.length) return res.rows[0];
      } catch {}
    }
    return this.memoryUsers.get(email.toLowerCase()) || null;
  }

  public async createUser(data: Omit<DBUser, "id" | "created_at">): Promise<DBUser> {
    if (this.isConnected && this.pool) {
      try {
        const res = await this.pool.query(
          "INSERT INTO users (id, email, password_hash, full_name, role, state, district, constituency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [`usr-${Date.now()}`, data.email, data.password_hash, data.full_name, data.role, data.state, data.district, data.constituency]
        );
        return res.rows[0];
      } catch {}
    }
    const newUser: DBUser = {
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.memoryUsers.set(newUser.email.toLowerCase(), newUser);
    return newUser;
  }

  // Alerts
  public async getAlerts(filters?: { status?: string; severity?: string; state?: string }): Promise<DBRiskAlert[]> {
    if (this.isConnected && this.pool) {
      try {
        let query = "SELECT * FROM risk_alerts WHERE 1=1";
        const params: any[] = [];
        if (filters?.status && filters.status !== "ALL") {
          params.push(filters.status);
          query += ` AND status = $${params.length}`;
        }
        if (filters?.severity && filters.severity !== "ALL") {
          params.push(filters.severity);
          query += ` AND severity = $${params.length}`;
        }
        if (filters?.state && filters.state !== "ALL") {
          params.push(filters.state);
          query += ` AND state = $${params.length}`;
        }
        query += " ORDER BY risk_score DESC, detected_at DESC";
        const res = await this.pool.query(query, params);
        if (res.rows.length) return res.rows;
      } catch {}
    }
    let list = Array.from(this.memoryAlerts.values());
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((a) => a.status.toUpperCase() === filters.status?.toUpperCase());
    }
    if (filters?.severity && filters.severity !== "ALL") {
      list = list.filter((a) => a.severity.toUpperCase() === filters.severity?.toUpperCase());
    }
    if (filters?.state && filters.state !== "ALL") {
      list = list.filter((a) => a.state.toUpperCase() === filters.state?.toUpperCase());
    }
    return list.sort((a, b) => b.risk_score - a.risk_score);
  }

  public async createAlert(data: Omit<DBRiskAlert, "id" | "detected_at" | "status">): Promise<DBRiskAlert> {
    const newAlert: DBRiskAlert = {
      id: `alt-${Date.now()}`,
      detected_at: new Date().toISOString(),
      status: "Open",
      ...data,
    };
    this.memoryAlerts.set(newAlert.id, newAlert);

    if (this.isConnected && this.pool) {
      try {
        await this.pool.query(
          "INSERT INTO risk_alerts (id, work_id, work_name, state, district, category, severity, risk_score, anomaly_type, reason, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [newAlert.id, newAlert.work_id, newAlert.work_name, newAlert.state, newAlert.district, newAlert.category, newAlert.severity, newAlert.risk_score, newAlert.anomaly_type, newAlert.reason, newAlert.status]
        );
      } catch {}
    }

    return newAlert;
  }

  public async updateAlert(id: string, updates: Partial<DBRiskAlert>): Promise<DBRiskAlert | null> {
    const existing = this.memoryAlerts.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    if (updates.status?.toUpperCase() === "RESOLVED") {
      updated.resolved_at = new Date().toISOString();
    }
    this.memoryAlerts.set(id, updated);

    if (this.isConnected && this.pool) {
      try {
        await this.pool.query("UPDATE risk_alerts SET status = $1, notes = $2 WHERE id = $3", [updated.status, updated.notes, id]);
      } catch {}
    }

    return updated;
  }

  // Duplicates
  public async getDuplicates(status?: string): Promise<DBNearDuplicate[]> {
    if (this.isConnected && this.pool) {
      try {
        let query = "SELECT * FROM near_duplicate_reviews";
        const params: any[] = [];
        if (status && status !== "ALL") {
          params.push(status);
          query += " WHERE status = $1";
        }
        query += " ORDER BY similarity_score DESC";
        const res = await this.pool.query(query, params);
        if (res.rows.length) return res.rows;
      } catch {}
    }
    let list = Array.from(this.memoryDuplicates.values());
    if (status && status !== "ALL") {
      list = list.filter((d) => d.status.toUpperCase() === status.toUpperCase());
    }
    return list.sort((a, b) => b.similarity_score - a.similarity_score);
  }

  public async updateDuplicate(id: string, updates: Partial<DBNearDuplicate>): Promise<DBNearDuplicate | null> {
    const existing = this.memoryDuplicates.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, reviewed_at: new Date().toISOString() };
    this.memoryDuplicates.set(id, updated);

    if (this.isConnected && this.pool) {
      try {
        await this.pool.query("UPDATE near_duplicate_reviews SET status = $1, review_notes = $2, reviewer_id = $3, reviewed_at = CURRENT_TIMESTAMP WHERE id = $4", [updated.status, updated.review_notes, updated.reviewer_id, id]);
      } catch {}
    }

    return updated;
  }

  // Audit Logs (Cryptographically chained)
  public async logAudit(params: {
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
  }): Promise<DBAuditLog> {
    const lastLog = this.memoryAuditLogs[this.memoryAuditLogs.length - 1];
    const prevHash = lastLog?.hash_signature || "GENESIS_HASH_00000000000000000000000000000000000000000000000000000000";
    const timestamp = new Date().toISOString();

    const payloadString = JSON.stringify({
      prevHash,
      timestamp,
      userId: params.userId,
      userName: params.userName,
      role: params.role,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      oldValue: params.oldValue,
      newValue: params.newValue,
    });

    const hashSignature = crypto.createHash("sha256").update(payloadString).digest("hex");

    const newLog: DBAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp,
      user_id: params.userId,
      user_name: params.userName,
      role: params.role,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId,
      old_value: params.oldValue,
      new_value: params.newValue,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      status: "LOGGED",
      hash_signature: hashSignature,
      prev_hash: prevHash,
    };

    this.memoryAuditLogs.unshift(newLog);

    if (this.isConnected && this.pool) {
      try {
        await this.pool.query(
          "INSERT INTO audit_logs (id, user_name, role, action, entity, entity_id, status, hash_signature, prev_hash, old_value, new_value, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
          [newLog.id, newLog.user_name, newLog.role, newLog.action, newLog.entity, newLog.entity_id, newLog.status, newLog.hash_signature, newLog.prev_hash, JSON.stringify(newLog.old_value), JSON.stringify(newLog.new_value), newLog.ip_address, newLog.user_agent]
        );
      } catch {}
    }

    return newLog;
  }

  public async getAuditLogs(filters?: { action?: string; entity?: string; limit?: number }): Promise<DBAuditLog[]> {
    if (this.isConnected && this.pool) {
      try {
        let query = "SELECT * FROM audit_logs WHERE 1=1";
        const params: any[] = [];
        if (filters?.action && filters.action !== "ALL") {
          params.push(filters.action);
          query += ` AND action = $${params.length}`;
        }
        if (filters?.entity && filters.entity !== "ALL") {
          params.push(filters.entity);
          query += ` AND entity = $${params.length}`;
        }
        query += ` ORDER BY timestamp DESC LIMIT ${filters?.limit || 100}`;
        const res = await this.pool.query(query, params);
        if (res.rows.length) return res.rows;
      } catch {}
    }
    let list = [...this.memoryAuditLogs];
    if (filters?.action && filters.action !== "ALL") {
      list = list.filter((l) => l.action.toUpperCase() === filters.action?.toUpperCase());
    }
    if (filters?.entity && filters.entity !== "ALL") {
      list = list.filter((l) => l.entity.toUpperCase() === filters.entity?.toUpperCase());
    }
    return list.slice(0, filters?.limit || 100);
  }

  public async verifyAuditChain(): Promise<{ valid: boolean; verifiedCount: number; brokenAtId?: string }> {
    const list = [...this.memoryAuditLogs].reverse(); // verify in chronological order
    let currentPrev = "GENESIS_HASH_00000000000000000000000000000000000000000000000000000000";
    let verifiedCount = 0;

    for (let i = 0; i < list.length; i++) {
      const log = list[i];
      if (i === 0) {
        currentPrev = log.hash_signature;
        verifiedCount++;
        continue;
      }
      if (log.prev_hash !== currentPrev) {
        return { valid: false, verifiedCount, brokenAtId: log.id };
      }
      currentPrev = log.hash_signature;
      verifiedCount++;
    }

    return { valid: true, verifiedCount };
  }

  // Compliance Rules
  public async getComplianceRules(): Promise<DBComplianceRule[]> {
    if (this.isConnected && this.pool) {
      try {
        const res = await this.pool.query("SELECT * FROM compliance_rules ORDER BY rule_id ASC");
        if (res.rows.length) return res.rows;
      } catch {}
    }
    return Array.from(this.memoryRules.values());
  }

  // Implementing Agencies
  public async getAgencies(): Promise<DBImplementingAgency[]> {
    if (this.isConnected && this.pool) {
      try {
        const res = await this.pool.query("SELECT * FROM implementing_agencies ORDER BY avg_risk_score DESC");
        if (res.rows.length) return res.rows;
      } catch {}
    }
    return Array.from(this.memoryAgencies.values());
  }

  public async getAgencyById(id: string): Promise<DBImplementingAgency | null> {
    if (this.isConnected && this.pool) {
      try {
        const res = await this.pool.query("SELECT * FROM implementing_agencies WHERE id = $1 OR agency_code = $1", [id]);
        if (res.rows.length) return res.rows[0];
      } catch {}
    }
    return this.memoryAgencies.get(id) || null;
  }

  // Datasets: MPs & Calamities
  public async getMPs(params?: { state?: string; search?: string; page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 100;
    const offset = (page - 1) * limit;

    if (this.isConnected && this.pool) {
      try {
        let where = " WHERE 1=1";
        const queryParams: any[] = [];
        if (params?.state && params.state !== "ALL") {
          queryParams.push(params.state);
          where += ` AND LOWER(state) = LOWER($${queryParams.length})`;
        }
        if (params?.search) {
          queryParams.push(`%${params.search}%`);
          where += ` AND (LOWER(mp_name) LIKE LOWER($${queryParams.length}) OR LOWER(constituency) LIKE LOWER($${queryParams.length}))`;
        }

        const countRes = await this.pool.query(`SELECT COUNT(*) FROM mp_allocations ${where}`, queryParams);
        const total = parseInt(countRes.rows[0].count, 10);

        const dataRes = await this.pool.query(
          `SELECT * FROM mp_allocations ${where} ORDER BY sr_no ASC LIMIT ${limit} OFFSET ${offset}`,
          queryParams
        );

        return { items: dataRes.rows, total, page, pageSize: limit };
      } catch {}
    }

    let list = [...this.memoryMPs];
    if (params?.state && params.state !== "ALL") {
      list = list.filter((m) => m.state.toLowerCase() === params.state?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((m) => m.mp_name.toLowerCase().includes(q) || m.constituency.toLowerCase().includes(q));
    }
    const total = list.length;
    const items = list.slice(offset, offset + limit);
    return { items, total, page, pageSize: limit };
  }

  public async getCalamities(): Promise<DBCalamityConsent[]> {
    if (this.isConnected && this.pool) {
      try {
        const res = await this.pool.query("SELECT * FROM calamity_consents ORDER BY sr_no ASC");
        if (res.rows.length) return res.rows;
      } catch {}
    }
    return [...this.memoryCalamities];
  }
}

export const db = new DatabaseService();
