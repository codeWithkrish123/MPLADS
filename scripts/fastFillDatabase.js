import pg from "pg";
import fs from "fs";
import path from "path";
import { SEEDED_MPS, SEEDED_CALAMITIES } from "../dist/data/seededData.js";

async function fastFill() {
  console.log("=================================================");
  console.log("⚡ Executing High-Speed Batch Database Population");
  console.log("=================================================");

  const caCandidates = [
    path.resolve("./ca.pem"),
    path.resolve("../ca.pem"),
    "C:\\Users\\Administrator\\Desktop\\AH\\ca.pem",
  ];

  let caContent = null;
  for (const p of caCandidates) {
    if (fs.existsSync(p)) {
      caContent = fs.readFileSync(p).toString();
      break;
    }
  }

  const pool = new pg.Pool({
    host: "mplads-mplads.b.aivencloud.com",
    port: 20967,
    user: "avnadmin",
    password: "AVNS_00vOurdxKZkGYugXHY3",
    database: "defaultdb",
    ssl: {
      rejectUnauthorized: false,
      ca: caContent || undefined,
    },
  });

  const client = await pool.connect();
  console.log("✅ Connected to Aiven PostgreSQL cloud instance!");

  try {
    // 1. Create Tables
    console.log("📦 Creating Database Tables...");
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
        hash_signature VARCHAR(128) NOT NULL,
        prev_hash VARCHAR(128)
      );
      ALTER TABLE audit_logs ALTER COLUMN hash_signature TYPE VARCHAR(128);
      ALTER TABLE audit_logs ALTER COLUMN prev_hash TYPE VARCHAR(128);

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
    console.log("✅ Tables created!");

    // 2. Batch Insert 543 MPs
    console.log(`📥 Batch inserting ${SEEDED_MPS.length} MPs...`);
    await client.query("DELETE FROM mp_allocations");

    const mpValues = [];
    const mpPlaceholders = [];
    let idx = 1;

    for (const mp of SEEDED_MPS) {
      mpPlaceholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`);
      mpValues.push(mp.id, mp.sr_no, mp.state, mp.mp_name, mp.constituency, mp.allocated_amount);
      idx += 6;
    }

    await client.query(
      `INSERT INTO mp_allocations (id, sr_no, state, mp_name, constituency, allocated_amount) VALUES ${mpPlaceholders.join(", ")}`,
      mpValues
    );
    console.log(`✅ ${SEEDED_MPS.length} MPs inserted in batch!`);

    // 3. Batch Insert Calamities (7 columns)
    console.log(`📥 Batch inserting ${SEEDED_CALAMITIES.length} Calamity Consents...`);
    await client.query("DELETE FROM calamity_consents");

    const calValues = [];
    const calPlaceholders = [];
    idx = 1;

    for (const c of SEEDED_CALAMITIES) {
      calPlaceholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6})`);
      calValues.push(c.id, c.sr_no, c.calamity_type, c.calamity_name, c.mp_name, c.consent_date, c.consent_amount);
      idx += 7;
    }

    await client.query(
      `INSERT INTO calamity_consents (id, sr_no, calamity_type, calamity_name, mp_name, consent_date, consent_amount) VALUES ${calPlaceholders.join(", ")}`,
      calValues
    );
    console.log(`✅ ${SEEDED_CALAMITIES.length} Calamity Consents inserted!`);

    // 4. Batch Insert Users
    console.log("📥 Batch inserting Users...");
    await client.query("DELETE FROM users");
    const demoUsers = [
      { id: "usr-ministry-01", email: "ministry@mplads.gov.in", password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.", full_name: "National Administrator (MoSPI)", role: "MINISTRY", state: null, district: null, constituency: null },
      { id: "usr-state-mh-01", email: "state.maharashtra@mplads.gov.in", password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.", full_name: "State Nodal Officer Maharashtra", role: "STATE_NODAL", state: "Maharashtra", district: null, constituency: null },
      { id: "usr-state-up-01", email: "state.up@mplads.gov.in", password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.", full_name: "State Nodal Officer Uttar Pradesh", role: "STATE_NODAL", state: "Uttar Pradesh", district: null, constituency: null },
      { id: "usr-dist-amr-01", email: "district.amravati@mplads.gov.in", password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.", full_name: "District Collector Amravati", role: "DISTRICT_AUTHORITY", state: "Maharashtra", district: "Amravati", constituency: null },
      { id: "usr-mp-var-01", email: "mp.varanasi@mplads.gov.in", password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.", full_name: "Shri Narendra Modi (Varanasi MP)", role: "MP", state: "Uttar Pradesh", district: "Varanasi", constituency: "VARANASI" },
      { id: "usr-citizen-01", email: "citizen@mplads.gov.in", password_hash: "$2a$10$w8.dPn939YVbM7h3vFz2wOaE4e8xkJ4fM2m0O1aG8Z6wD4qE6v8x.", full_name: "Public Citizen / Social Auditor", role: "CITIZEN", state: null, district: null, constituency: null },
    ];
    for (const u of demoUsers) {
      await client.query(
        "INSERT INTO users (id, email, password_hash, full_name, role, state, district, constituency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [u.id, u.email, u.password_hash, u.full_name, u.role, u.state, u.district, u.constituency]
      );
    }

    // 5. Batch Insert Compliance Rules
    console.log("📥 Batch inserting Compliance Rules...");
    await client.query("DELETE FROM compliance_rules");
    const rules = [
      { id: "rule-01", rule_id: "RULE-001", title: "Cost Deviation from District Median", category: "FINANCIAL", severity: "CRITICAL", status: "ACTIVE_POLICY", policy_version: "2.1", effective_date: "2024-01-01", source_document: "MPLADS Guidelines 2023, Para 4.1", policy_statement: "Sanctioned expenditure must not exceed +50% of the district median peer estimate for identical work categories.", threshold_description: "> 50% deviation from peer median cost", detection_logic: "cost > (peer_median * 1.5)", affected_works_count: 24 },
      { id: "rule-02", rule_id: "RULE-002", title: "Statutory 1-Year Completion Timeline", category: "IMPLEMENTATION", severity: "HIGH", status: "ACTIVE_POLICY", policy_version: "2.1", effective_date: "2024-01-01", source_document: "MPLADS Guidelines 2023, Para 3.8", policy_statement: "Works sanctioned under MPLADS must be completed within 12 months of sanction order issuance.", threshold_description: "> 365 days from sanction date without completion", detection_logic: "days_since_sanction > 365 AND status != 'Completed'", affected_works_count: 38 },
      { id: "rule-03", rule_id: "RULE-003", title: "Financial Draw vs Physical Progress Mismatch", category: "COMPLIANCE", severity: "CRITICAL", status: "ACTIVE_POLICY", policy_version: "2.0", effective_date: "2024-01-01", source_document: "GFR 2017 Rule 229 & MPLADS Rule 5.3", policy_statement: "Expenditure drawn must closely mirror verified physical progress. A delta > 40% constitutes financial anomaly.", threshold_description: "Financial progress > Physical progress + 40%", detection_logic: "(financial_progress - physical_progress) > 40", affected_works_count: 19 },
      { id: "rule-04", rule_id: "RULE-004", title: "Annexure-VIII Prohibited Work Category Match", category: "COMPLIANCE", severity: "HIGH", status: "ACTIVE_POLICY", policy_version: "2.2", effective_date: "2024-01-01", source_document: "MPLADS Annexure-VIII (Inadmissible Works)", policy_statement: "Works must conform to permissible community infrastructure. Vague descriptions with < 20% semantic similarity to approved works require audit verification.", threshold_description: "Semantic similarity < 20% to permissible activities", detection_logic: "nlp_similarity < 0.20", affected_works_count: 42 },
      { id: "rule-05", rule_id: "RULE-005", title: "Geospatial Duplicate Work Detection", category: "ANOMALY", severity: "HIGH", status: "ACTIVE_POLICY", policy_version: "2.0", effective_date: "2024-01-01", source_document: "MPLADS Anti-Duplication Directives 2024", policy_statement: "Works within 200 meters of another project with >80% semantic match require immediate human verification before fund release.", threshold_description: "Distance < 200m AND Similarity > 80%", detection_logic: "geo_dist < 200 AND text_sim > 0.80", affected_works_count: 15 },
    ];
    for (const r of rules) {
      await client.query(
        "INSERT INTO compliance_rules (id, rule_id, title, category, severity, status, policy_version, effective_date, source_document, policy_statement, threshold_description, detection_logic, affected_works_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
        [r.id, r.rule_id, r.title, r.category, r.severity, r.status, r.policy_version, r.effective_date, r.source_document, r.policy_statement, r.threshold_description, r.detection_logic, r.affected_works_count]
      );
    }

    // 6. Batch Insert Implementing Agencies
    console.log("📥 Batch inserting Agencies...");
    await client.query("DELETE FROM implementing_agencies");
    const agencies = [
      { id: "agy-01", agency_code: "AGY-MH-PWD-01", name: "Public Works Department (Amravati Division)", short_name: "PWD Amravati", type: "PWD", state: "Maharashtra", district: "Amravati", risk_category: "HIGH", avg_risk_score: 72.5, total_works: 45, completed_works: 22, delayed_works: 14, high_risk_works: 9, active_expenditure_cr: 12.8 },
      { id: "agy-02", agency_code: "AGY-HR-RWD-01", name: "Rural Works Development Agency (Jhajjar/Sonipat)", short_name: "RWD Haryana", type: "Rural Works", state: "Haryana", district: "Jhajjar", risk_category: "CRITICAL", avg_risk_score: 81.0, total_works: 32, completed_works: 14, delayed_works: 12, high_risk_works: 6, active_expenditure_cr: 15.2 },
      { id: "agy-03", agency_code: "AGY-WB-PHED-01", name: "Public Health Engineering Directorate (North 24 Parganas)", short_name: "PHED Bengal", type: "Water Supply", state: "West Bengal", district: "North 24 Parganas", risk_category: "HIGH", avg_risk_score: 68.4, total_works: 38, completed_works: 24, delayed_works: 9, high_risk_works: 5, active_expenditure_cr: 9.4 },
      { id: "agy-04", agency_code: "AGY-AP-PRD-01", name: "Panchayati Raj Engineering Department (Chittoor)", short_name: "PRD Chittoor", type: "Panchayati Raj", state: "Andhra Pradesh", district: "Chittoor", risk_category: "MEDIUM", avg_risk_score: 48.0, total_works: 52, completed_works: 38, delayed_works: 10, high_risk_works: 4, active_expenditure_cr: 11.5 },
      { id: "agy-05", agency_code: "AGY-UP-JN-01", name: "UP Jal Nigam (Varanasi Division)", short_name: "UP Jal Nigam Varanasi", type: "Water Supply", state: "Uttar Pradesh", district: "Varanasi", risk_category: "LOW", avg_risk_score: 22.1, total_works: 64, completed_works: 56, delayed_works: 5, high_risk_works: 3, active_expenditure_cr: 18.0 },
    ];
    for (const a of agencies) {
      await client.query(
        "INSERT INTO implementing_agencies (id, agency_code, name, short_name, type, state, district, risk_category, avg_risk_score, total_works, completed_works, delayed_works, high_risk_works, active_expenditure_cr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
        [a.id, a.agency_code, a.name, a.short_name, a.type, a.state, a.district, a.risk_category, a.avg_risk_score, a.total_works, a.completed_works, a.delayed_works, a.high_risk_works, a.active_expenditure_cr]
      );
    }

    // 7. Batch Insert Risk Alerts
    console.log("📥 Batch inserting Risk Alerts...");
    await client.query("DELETE FROM risk_alerts");
    const alerts = [
      { id: "alt-01", work_id: "WS/MP18065/2024-2025/135794", work_name: "17 Village Prajapat Choupal Construction", state: "Haryana", district: "Jhajjar", category: "Community Infrastructure", severity: "CRITICAL", risk_score: 80.0, anomaly_type: "Progress & Delay", reason: "Expenditure-progress mismatch: Financial is 100% but Physical is 14% (+86 pts); Delayed 198 days beyond 1-year guideline.", status: "Open" },
      { id: "alt-02", work_id: "WS/MP18250/2024-2025/135268", work_name: "Installation of 10 nos. Arsenic Free water tank under Shasan G.P", state: "West Bengal", district: "North 24 Parganas", category: "Drinking Water Facility", severity: "HIGH", risk_score: 72.0, anomaly_type: "Cost & Progress", reason: "Cost is 679.9% above peer median; Financial is 100% but Physical is 48%.", status: "Under Investigation" },
      { id: "alt-03", work_id: "WS/MP18006/2024-2025/135648", work_name: "Construction of CC Road from Nellepalli Mitta to Milk Dairy", state: "Andhra Pradesh", district: "Chittoor", category: "Rural Road Improvement", severity: "HIGH", risk_score: 60.0, anomaly_type: "Duplicate & Progress", reason: "Highly similar work description (84.8% match) found in same district (WS/MP18006/2024-2025/135650); 100% funds drawn vs 49% physical progress.", status: "Open" },
      { id: "alt-04", work_id: "WS/MP643/2024-2025/135993", work_name: "HIGH MASK SOLAR LIGHTS INSTALLATION", state: "Madhya Pradesh", district: "Khargone (West Nimar)", category: "Renewable Energy", severity: "HIGH", risk_score: 64.0, anomaly_type: "Duplicate Work Order", reason: "100% identical title and sanctioned on the exact same date as WS/MP643/2024-2025/135994.", status: "Under Investigation" },
      { id: "alt-05", work_id: "WS/MP18006/2024-2025/135650", work_name: "Construction of CC Road from Milk Dairy to Juice Factory in Nellepalli Mitta", state: "Andhra Pradesh", district: "Chittoor", category: "Rural Road Improvement", severity: "MEDIUM", risk_score: 48.0, anomaly_type: "Proximity Cluster", reason: "Geospatial proximity to existing CC road segment (145 meters separation).", status: "Open" },
    ];
    for (const al of alerts) {
      await client.query(
        "INSERT INTO risk_alerts (id, work_id, work_name, state, district, category, severity, risk_score, anomaly_type, reason, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [al.id, al.work_id, al.work_name, al.state, al.district, al.category, al.severity, al.risk_score, al.anomaly_type, al.reason, al.status]
      );
    }

    // 8. Near Duplicate Reviews
    console.log("📥 Batch inserting Near Duplicate Reviews...");
    await client.query("DELETE FROM near_duplicate_reviews");
    const duplicates = [
      { id: "dup-01", work_a_id: "WS/MP18006/2024-2025/135648", work_b_id: "WS/MP18006/2024-2025/135650", work_a_name: "Construction of CC Road from Nellepalli Mitta to Milk Dairy", work_b_name: "Construction of CC Road from Milk Dairy to Juice Factory in Nellepalli Mitta", state: "Andhra Pradesh", district: "Chittoor", similarity_score: 84.8, geo_distance_meters: 145.0, status: "Requires Human Review", review_notes: "Both works share the exact same starting landmark and contractor agency." },
      { id: "dup-02", work_a_id: "WS/MP643/2024-2025/135993", work_b_id: "WS/MP643/2024-2025/135994", work_a_name: "HIGH MASK SOLAR LIGHTS", work_b_name: "HIGH MASK SOLAR LIGHTS", state: "Madhya Pradesh", district: "Khargone (West Nimar)", similarity_score: 100.0, geo_distance_meters: 50.0, status: "Requires Human Review", review_notes: "100% identical title and sanctioned on the same date (2024-09-11)." },
    ];
    for (const d of duplicates) {
      await client.query(
        "INSERT INTO near_duplicate_reviews (id, work_a_id, work_b_id, work_a_name, work_b_name, state, district, similarity_score, geo_distance_meters, status, review_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [d.id, d.work_a_id, d.work_b_id, d.work_a_name, d.work_b_name, d.state, d.district, d.similarity_score, d.geo_distance_meters, d.status, d.review_notes]
      );
    }

    // 9. Audit Logs
    console.log("📥 Initializing Cryptographic Audit Ledger...");
    await client.query("DELETE FROM audit_logs");
    const genesisHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    await client.query(
      "INSERT INTO audit_logs (id, user_name, role, action, entity, entity_id, status, hash_signature, prev_hash, new_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      ["aud-001", "System Bootstrapper", "MINISTRY", "DATABASE_INITIALIZED_AND_SEEDED", "PostgreSQL", "AIVEN-PG-001", "LOGGED", genesisHash, "GENESIS_HASH_00000000000000000000000000000000000000000000000000000000", JSON.stringify({ total_mps: 543, total_calamities: 12, cloud_db: "Aiven PostgreSQL" })]
    );

    // Verify Counts
    const mpCount = await client.query("SELECT count(*) FROM mp_allocations");
    const calCount = await client.query("SELECT count(*) FROM calamity_consents");
    const ruleCount = await client.query("SELECT count(*) FROM compliance_rules");
    const agyCount = await client.query("SELECT count(*) FROM implementing_agencies");
    const altCount = await client.query("SELECT count(*) FROM risk_alerts");
    const usrCount = await client.query("SELECT count(*) FROM users");
    const audCount = await client.query("SELECT count(*) FROM audit_logs");

    console.log("=================================================");
    console.log("🎉 CLOUD DATABASE POPULATION FINISHED SUCCESSFULLY!");
    console.log(`📊 Total Lok Sabha MPs Seeded: ${mpCount.rows[0].count} / 543`);
    console.log(`📊 Total Calamity Consents Seeded: ${calCount.rows[0].count} / 12`);
    console.log(`📊 Total Compliance Policies Seeded: ${ruleCount.rows[0].count}`);
    console.log(`📊 Total Implementing Agencies Seeded: ${agyCount.rows[0].count}`);
    console.log(`📊 Total Risk Alerts Seeded: ${altCount.rows[0].count}`);
    console.log(`📊 Total Government Users Seeded: ${usrCount.rows[0].count}`);
    console.log(`📊 Total Audit Logs Seeded: ${audCount.rows[0].count}`);
    console.log("=================================================");
  } finally {
    client.release();
    await pool.end();
  }
}

fastFill().catch((e) => {
  console.error("❌ Fast Fill failed:", e);
  process.exit(1);
});
