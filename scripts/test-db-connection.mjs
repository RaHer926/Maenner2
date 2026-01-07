import postgres from 'postgres';

const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No database connection string found');
  process.exit(1);
}

console.log('🔄 Testing database connection...');
console.log('Connection string format:', connectionString.replace(/:[^:@]*@/, ':***@'));

// Test 1: Basic connection without SSL
console.log('\n📝 Test 1: Basic connection (no SSL)');
try {
  const client1 = postgres(connectionString, { 
    max: 1, 
    connect_timeout: 10,
    ssl: false
  });
  
  const result1 = await client1`SELECT version()`;
  console.log('✅ Test 1 SUCCESS:', result1[0].version.substring(0, 50) + '...');
  await client1.end();
} catch (error) {
  console.log('❌ Test 1 FAILED:', error.message);
}

// Test 2: Connection with SSL required
console.log('\n📝 Test 2: Connection with SSL required');
try {
  const client2 = postgres(connectionString, { 
    max: 1, 
    connect_timeout: 10,
    ssl: 'require'
  });
  
  const result2 = await client2`SELECT version()`;
  console.log('✅ Test 2 SUCCESS:', result2[0].version.substring(0, 50) + '...');
  await client2.end();
} catch (error) {
  console.log('❌ Test 2 FAILED:', error.message);
}

// Test 3: Connection with SSL prefer
console.log('\n📝 Test 3: Connection with SSL prefer');
try {
  const client3 = postgres(connectionString, { 
    max: 1, 
    connect_timeout: 10,
    ssl: 'prefer'
  });
  
  const result3 = await client3`SELECT version()`;
  console.log('✅ Test 3 SUCCESS:', result3[0].version.substring(0, 50) + '...');
  await client3.end();
} catch (error) {
  console.log('❌ Test 3 FAILED:', error.message);
}

// Test 4: Connection with custom SSL options
console.log('\n📝 Test 4: Connection with custom SSL options');
try {
  const client4 = postgres(connectionString, { 
    max: 1, 
    connect_timeout: 10,
    ssl: { rejectUnauthorized: false }
  });
  
  const result4 = await client4`SELECT version()`;
  console.log('✅ Test 4 SUCCESS:', result4[0].version.substring(0, 50) + '...');
  await client4.end();
} catch (error) {
  console.log('❌ Test 4 FAILED:', error.message);
}

console.log('\n✅ Connection tests completed');
process.exit(0);
