import postgres from 'postgres';

const connectionString = process.env.RAILWAY_DATABASE_URL;

if (!connectionString) {
  console.error('RAILWAY_DATABASE_URL is not set');
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });

async function migrate() {
  try {
    console.log('Creating patients table...');
    await client`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "dateOfBirth" TEXT,
        email TEXT,
        phone TEXT,
        "patientNumber" TEXT,
        "createdBy" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Creating surveys table...');
    await client`
      CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        "patientId" INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        language TEXT DEFAULT 'de',
        answers JSONB NOT NULL,
        scores JSONB NOT NULL,
        "totalScore" INTEGER,
        notes TEXT,
        "createdBy" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Creating survey_recommendations table...');
    await client`
      CREATE TABLE IF NOT EXISTS survey_recommendations (
        id SERIAL PRIMARY KEY,
        "surveyId" INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
        section TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        priority TEXT,
        status TEXT DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
