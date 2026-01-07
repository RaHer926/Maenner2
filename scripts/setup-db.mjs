import postgres from 'postgres';

const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No database connection string found');
  process.exit(1);
}

console.log('🔄 Connecting to database...');

const client = postgres(connectionString, { max: 1, connect_timeout: 30, ssl: 'require' });

async function setupDatabase() {
  try {
    console.log('📊 Creating tables...');
    
    // Create users table
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'doctor',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Users table created');

    // Create index on users
    await client`CREATE INDEX IF NOT EXISTS users_email_idx ON users(email)`;
    
    // Create patients table
    await client`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        date_of_birth VARCHAR(10),
        email VARCHAR(255),
        phone VARCHAR(50),
        patient_number VARCHAR(100) UNIQUE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Patients table created');

    // Create indexes on patients
    await client`CREATE INDEX IF NOT EXISTS patients_patient_number_idx ON patients(patient_number)`;
    await client`CREATE INDEX IF NOT EXISTS patients_last_name_idx ON patients(last_name)`;
    
    // Create surveys table
    await client`
      CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        language VARCHAR(10) NOT NULL DEFAULT 'de',
        answers JSONB NOT NULL,
        scores JSONB NOT NULL,
        total_score INTEGER,
        completed_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by INTEGER REFERENCES users(id),
        notes TEXT
      )
    `;
    console.log('✅ Surveys table created');

    // Create indexes on surveys
    await client`CREATE INDEX IF NOT EXISTS surveys_patient_id_idx ON surveys(patient_id)`;
    await client`CREATE INDEX IF NOT EXISTS surveys_completed_at_idx ON surveys(completed_at)`;
    
    // Create recommendations table
    await client`
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        section VARCHAR(50) NOT NULL,
        min_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        recommendation TEXT NOT NULL,
        supplements JSONB,
        priority VARCHAR(20) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Recommendations table created');

    // Create index on recommendations
    await client`CREATE INDEX IF NOT EXISTS recommendations_section_idx ON recommendations(section)`;
    
    // Create survey_recommendations table
    await client`
      CREATE TABLE IF NOT EXISTS survey_recommendations (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
        section VARCHAR(50) NOT NULL,
        recommendation TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'pending',
        modified_by INTEGER REFERENCES users(id),
        modified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Survey recommendations table created');

    // Create indexes on survey_recommendations
    await client`CREATE INDEX IF NOT EXISTS survey_recommendations_survey_id_idx ON survey_recommendations(survey_id)`;
    await client`CREATE INDEX IF NOT EXISTS survey_recommendations_status_idx ON survey_recommendations(status)`;
    
    // Create audit_logs table
    await client`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        details JSONB,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Audit logs table created');

    // Create indexes on audit_logs
    await client`CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs(user_id)`;
    await client`CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action)`;
    await client`CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at)`;
    
    console.log('✅ All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

setupDatabase();
